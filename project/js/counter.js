/**
 * Counter class for calculating and formatting age in seconds
 */
class AgeCounter {
  constructor(birthdate) {
    this.birthdate = birthdate ? new Date(birthdate) : null;
    this.interval = null;
    this.listeners = [];
  }

  setBirthdate(birthdate) {
    this.birthdate = new Date(birthdate);
  }

  /**
   * Calculate age in seconds
   */
  calculateAgeInSeconds() {
    if (!this.birthdate) return { seconds: 0, milliseconds: 0 };
    
    const now = new Date();
    const diffInMs = now - this.birthdate;
    const seconds = Math.floor(diffInMs / 1000);
    const milliseconds = diffInMs % 1000;
    
    return { seconds, milliseconds };
  }

  /**
   * Format seconds into years, days, hours, minutes, seconds
   */
  formatAge(seconds) {
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365.25; // Accounting for leap years
    
    const years = Math.floor(seconds / year);
    seconds %= year;
    
    const days = Math.floor(seconds / day);
    seconds %= day;
    
    const hours = Math.floor(seconds / hour);
    seconds %= hour;
    
    const minutes = Math.floor(seconds / minute);
    seconds %= minute;
    
    return {
      years,
      days,
      hours,
      minutes,
      seconds
    };
  }

  /**
   * Start counter with given update interval
   */
  start(updateInterval = 100) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    if (!this.birthdate) return;
    
    this.interval = setInterval(() => {
      const age = this.calculateAgeInSeconds();
      const formattedAge = this.formatAge(age.seconds);
      
      // Notify all listeners
      this.listeners.forEach(listener => {
        listener({
          ...formattedAge,
          totalSeconds: age.seconds,
          milliseconds: age.milliseconds
        });
      });
    }, updateInterval);
  }

  /**
   * Stop counter
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Add update listener
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove update listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }
}