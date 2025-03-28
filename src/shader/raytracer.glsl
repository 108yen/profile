#define M_PI 3.141592653589793238462643383279
#define R_SQRT_2 0.7071067811865475
#define DEG_TO_RAD (M_PI/180.0)
#define SQ(x) ((x)*(x))

#define ROT_Y(a) mat3(0, cos(a), sin(a), 1, 0, 0, 0, sin(a), -cos(a))


// spectrum texture lookup helper macros
const float BLACK_BODY_TEXTURE_COORD = 1.0;
const float SINGLE_WAVELENGTH_TEXTURE_COORD = 0.5;
const float TEMPERATURE_LOOKUP_RATIO_TEXTURE_COORD = 0.0;

// black-body texture metadata
const float SPECTRUM_TEX_TEMPERATURE_RANGE = 65504.0;
const float SPECTRUM_TEX_WAVELENGTH_RANGE = 2048.0;
const float SPECTRUM_TEX_RATIO_RANGE = 6.48053329012;

// multi-line macros don't seem to work in WebGL :(
#define BLACK_BODY_COLOR(t) texture2D(spectrum_texture, vec2((t) / SPECTRUM_TEX_TEMPERATURE_RANGE, BLACK_BODY_TEXTURE_COORD))
#define SINGLE_WAVELENGTH_COLOR(lambda) texture2D(spectrum_texture, vec2((lambda) / SPECTRUM_TEX_WAVELENGTH_RANGE, SINGLE_WAVELENGTH_TEXTURE_COORD))
#define TEMPERATURE_LOOKUP(ratio) (texture2D(spectrum_texture, vec2((ratio) / SPECTRUM_TEX_RATIO_RANGE, TEMPERATURE_LOOKUP_RATIO_TEXTURE_COORD)).r * SPECTRUM_TEX_TEMPERATURE_RANGE)

uniform vec2 resolution;

uniform vec3 cam_pos;
uniform vec3 cam_x;
uniform vec3 cam_y;
uniform vec3 cam_z;

vec3 cam_vel = vec3(0.0,0.0,0.0);

uniform sampler2D galaxy_texture, star_texture,
    accretion_disk_texture, spectrum_texture;

// stepping parameters
const int NSTEPS = 50;
const float MAX_REVOLUTIONS = 2.0;

const float ACCRETION_MIN_R = 1.5;
const float ACCRETION_WIDTH = 3.0;
const float ACCRETION_BRIGHTNESS = 0.9;
const float ACCRETION_TEMPERATURE = 3900.0;

const float STAR_MIN_TEMPERATURE = 4000.0;
const float STAR_MAX_TEMPERATURE = 15000.0;

const float STAR_BRIGHTNESS = 1.0;
const float GALAXY_BRIGHTNESS = 0.4;

const float PLANET_AMBIENT = 0.1;
const float PLANET_LIGHTNESS = 1.5;

// background texture coordinate system
mat3 BG_COORDS = ROT_Y(45.0 * DEG_TO_RAD);

// planet texture coordinate system
const float PLANET_AXIAL_TILT = 30.0 * DEG_TO_RAD;
mat3 PLANET_COORDS = ROT_Y(PLANET_AXIAL_TILT);

const float FOV_ANGLE_DEG = 90.0;
float FOV_MULT = 1.0 / tan(DEG_TO_RAD * FOV_ANGLE_DEG*0.5);

vec2 sphere_map(vec3 p) {
    return vec2(atan(p.x,p.y)/M_PI*0.5+0.5, asin(p.z)/M_PI+0.5);
}

float smooth_step(float x, float threshold) {
    const float STEEPNESS = 1.0;
    return 1.0 / (1.0 + exp(-(x-threshold)*STEEPNESS));
}

vec3 lorentz_velocity_transformation(vec3 moving_v, vec3 frame_v) {
    float v = length(frame_v);
    if (v > 0.0) {
        vec3 v_axis = -frame_v / v;
        float gamma = 1.0/sqrt(1.0 - v*v);

        float moving_par = dot(moving_v, v_axis);
        vec3 moving_perp = moving_v - v_axis*moving_par;

        float denom = 1.0 + v*moving_par;
        return (v_axis*(moving_par+v)+moving_perp/gamma)/denom;
    }
    return moving_v;
}

vec3 contract(vec3 x, vec3 d, float mult) {
    float par = dot(x,d);
    return (x-par*d) + d*par*mult;
}

vec4 galaxy_color(vec2 tex_coord, float doppler_factor) {

    vec4 color = texture2D(galaxy_texture, tex_coord);
    
    vec4 ret = vec4(0.0,0.0,0.0,0.0);
    float red = max(0.0, color.r - color.g);

    const float H_ALPHA_RATIO = 0.1;
    const float TEMPERATURE_BIAS = 0.95;

    color.r -= red*H_ALPHA_RATIO;

    float i1 = max(color.r, max(color.g, color.b));
    float ratio = (color.g+color.b) / color.r;

    if (i1 > 0.0 && color.r > 0.0) {

        float temperature = TEMPERATURE_LOOKUP(ratio) * TEMPERATURE_BIAS;
        color = BLACK_BODY_COLOR(temperature);

        float i0 = max(color.r, max(color.g, color.b));
        if (i0 > 0.0) {
            temperature /= doppler_factor;
            ret = BLACK_BODY_COLOR(temperature) * max(i1/i0,0.0);
        }
    }

    ret += SINGLE_WAVELENGTH_COLOR(656.28 * doppler_factor) * red / 0.214 * H_ALPHA_RATIO;

    return ret;
}

void main() {
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    p.y *= resolution.y / resolution.x;

    vec3 pos = cam_pos;
    vec3 ray = normalize(p.x*cam_x + p.y*cam_y + FOV_MULT*cam_z);

    ray = lorentz_velocity_transformation(ray, cam_vel);

    float ray_intensity = 1.0;
    float ray_doppler_factor = 1.0;

    float gamma = 1.0/sqrt(1.0-dot(cam_vel,cam_vel));
    ray_doppler_factor = gamma*(1.0 + dot(ray,-cam_vel));
    ray_intensity /= ray_doppler_factor*ray_doppler_factor*ray_doppler_factor;

    float step = 0.01;
    vec4 color = vec4(0.0,0.0,0.0,1.0);

    // initial conditions
    float u = 1.0 / length(pos), old_u;
    float u0 = u;

    vec3 normal_vec = normalize(pos);
    vec3 tangent_vec = normalize(cross(cross(normal_vec, ray), normal_vec));

    float du = -dot(ray,normal_vec) / dot(ray,tangent_vec) * u;
    float du0 = du;

    float phi = 0.0;
    float dt = 1.0;

    vec3 old_pos;

    for (int j=0; j < NSTEPS; j++) {

        step = MAX_REVOLUTIONS * 2.0*M_PI / float(NSTEPS);

        // adaptive step size, some ad hoc formulas
        float max_rel_u_change = (1.0-log(u))*10.0 / float(NSTEPS);
        if ((du > 0.0 || (du0 < 0.0 && u0/u < 5.0)) && abs(du) > abs(max_rel_u_change*u) / step)
            step = max_rel_u_change*u/abs(du);

        old_u = u;

        dt = sqrt(du*du + u*u*(1.0-u))/(u*u*(1.0-u))*step;

        // Leapfrog scheme
        u += du*step;
        float ddu = -u*(1.0 - 1.5*u*u);
        du += ddu*step;

        if (u < 0.0) break;

        phi += step;

        old_pos = pos;
        pos = (cos(phi)*normal_vec + sin(phi)*tangent_vec)/u;

        ray = pos-old_pos;
        float solid_isec_t = 2.0;
        float ray_l = length(ray);

        float mix = smooth_step(1.0/u, 8.0);
        dt = mix*ray_l + (1.0-mix)*dt;

        if (old_pos.z * pos.z < 0.0) {

            float acc_isec_t = -old_pos.z / ray.z;
            if (acc_isec_t < solid_isec_t) {
                vec3 isec = old_pos + ray*acc_isec_t;

                float r = length(isec);

                if (r > ACCRETION_MIN_R) {
                    vec2 tex_coord = vec2(
                            (r-ACCRETION_MIN_R)/ACCRETION_WIDTH,
                            atan(isec.x, isec.y)/M_PI*0.5+0.5
                    );

                    float accretion_intensity = ACCRETION_BRIGHTNESS;
                    //accretion_intensity *= 1.0 / abs(ray.z/ray_l);
                    float temperature = ACCRETION_TEMPERATURE;

                    vec3 accretion_v = vec3(-isec.y, isec.x, 0.0) / sqrt(2.0*(r-1.0)) / (r*r);
                    gamma = 1.0/sqrt(1.0-dot(accretion_v,accretion_v));
                    float doppler_factor = gamma*(1.0+dot(ray/ray_l,accretion_v));
                    accretion_intensity /= doppler_factor*doppler_factor*doppler_factor;
                    temperature /= ray_doppler_factor*doppler_factor;

                    color += texture2D(accretion_disk_texture,tex_coord)
                        * accretion_intensity
                        * BLACK_BODY_COLOR(temperature);
                }
            }
        }

        if (solid_isec_t <= 1.0) u = 2.0; // break
        if (u > 1.0) break;
    }

    // the event horizon is at u = 1
    if (u < 1.0) {
        ray = normalize(pos - old_pos);
        vec2 tex_coord = sphere_map(ray * BG_COORDS);
        float t_coord;

        vec4 star_color = texture2D(star_texture, tex_coord);
        if (star_color.r > 0.0) {
            t_coord = (STAR_MIN_TEMPERATURE +
                (STAR_MAX_TEMPERATURE-STAR_MIN_TEMPERATURE) * star_color.g)
                 / ray_doppler_factor;

            color += BLACK_BODY_COLOR(t_coord) * star_color.r * STAR_BRIGHTNESS;
        }

        color += galaxy_color(tex_coord, ray_doppler_factor) * GALAXY_BRIGHTNESS;
    }

    vec4 computedColor = color*ray_intensity;
    gl_FragColor = computedColor;

    // if(computedColor.r<0.1&&computedColor.g<0.1&&computedColor.b<0.1) {
    //     gl_FragColor = vec4(1.0 - computedColor.rgb, computedColor.a);
    // } else { 
    //     gl_FragColor = computedColor;
    // }
}