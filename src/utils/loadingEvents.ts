"use client"

export class LoadingEvents {
  private static listeners: Record<string, Array<(data?: any) => void>> = {}

  static on(event: string, callback: (data?: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
    return () => this.off(event, callback)
  }

  static off(event: string, callback: (data?: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback,
      )
    }
  }

  static emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data))
    }
  }
}
