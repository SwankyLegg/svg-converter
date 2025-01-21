// Utility for consistent Google Analytics event tracking

/**
 * Log an event to Google Analytics
 * @param {string} eventName - The name of the event to log
 * @param {Object} [params] - Optional parameters to include with the event
 */
const logEvent = async (eventName, params = {}) => {
  try {
    if (typeof window === 'undefined' || !window.gtag) {
      console.warn('Google Analytics not initialized');
      return;
    }

    window.gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('GA Event:', { eventName, params });
    }
  } catch (error) {
    console.error('Failed to log event:', error);
  }
};

// Common event names for consistency
export const EventTypes = {
  PAGE_VIEW: 'page_view',
  FILE_UPLOAD: 'file_upload',
  CONVERSION_START: 'conversion_start',
  CONVERSION_COMPLETE: 'conversion_complete',
  CONVERSION_ERROR: 'conversion_error',
  DOWNLOAD: 'download',
  FORMAT_CHANGE: 'format_change',
  SIZE_CHANGE: 'size_change',
};

// Helper functions for common events
export const logFileUpload = (fileCount, fileTypes) => {
  logEvent(EventTypes.FILE_UPLOAD, {
    file_count: fileCount,
    file_types: fileTypes,
  });
};

export const logConversionStart = (format, sizes) => {
  logEvent(EventTypes.CONVERSION_START, {
    format,
    sizes: JSON.stringify(sizes),
  });
};

export const logConversionComplete = (format, sizes, duration) => {
  logEvent(EventTypes.CONVERSION_COMPLETE, {
    format,
    sizes: JSON.stringify(sizes),
    duration_ms: duration,
  });
};

export const logConversionError = (error, format, sizes) => {
  logEvent(EventTypes.CONVERSION_ERROR, {
    error_message: error.message,
    format,
    sizes: JSON.stringify(sizes),
  });
};

export const logDownload = (format, sizes) => {
  logEvent(EventTypes.DOWNLOAD, {
    format,
    sizes: JSON.stringify(sizes),
  });
};

export const logFormatChange = (formats) => {
  logEvent(EventTypes.FORMAT_CHANGE, {
    selected_formats: JSON.stringify(formats),
  });
};

export const logSizeChange = (sizes) => {
  logEvent(EventTypes.SIZE_CHANGE, {
    selected_sizes: JSON.stringify(sizes),
  });
};

export { logEvent };
