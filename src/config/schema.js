export const TRAFFIC_WINDOW_MODES = new Set(['daily', 'rolling_7d', 'rolling_30d']);

const REQUIRED_SEVERITIES = ['critical', 'serious', 'moderate', 'minor'];

function assertObject(value, name, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${name} must be an object`);
    return false;
  }
  return true;
}

function assertNumberInRange(value, name, min, max, errors) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    errors.push(`${name} must be a number`);
    return;
  }
  if (value < min || value > max) {
    errors.push(`${name} must be between ${min} and ${max}`);
  }
}

export function validatePrevalenceConfig(config) {
  const errors = [];

  if (!assertObject(config, 'config', errors)) {
    return { valid: false, errors };
  }

  if (!assertObject(config.scan, 'scan', errors)) {
    return { valid: false, errors };
  }

  if (!assertObject(config.impact, 'impact', errors)) {
    return { valid: false, errors };
  }

  const { scan, impact } = config;

  if (typeof scan.url_limit !== 'number' || !Number.isInteger(scan.url_limit) || scan.url_limit < 1) {
    errors.push('scan.url_limit must be an integer greater than 0');
  }

  if (scan.dap_page_size !== undefined) {
    if (typeof scan.dap_page_size !== 'number' || !Number.isInteger(scan.dap_page_size) || scan.dap_page_size < 1) {
      errors.push('scan.dap_page_size must be an integer greater than 0 when provided');
    }
  }

  if (
    typeof scan.history_lookback_days !== 'number' ||
    !Number.isInteger(scan.history_lookback_days) ||
    scan.history_lookback_days < 1
  ) {
    errors.push('scan.history_lookback_days must be an integer greater than 0');
  }

  if (!TRAFFIC_WINDOW_MODES.has(scan.traffic_window_mode)) {
    errors.push(`scan.traffic_window_mode must be one of: ${Array.from(TRAFFIC_WINDOW_MODES).join(', ')}`);
  }

  if (scan.dashboard_display_days !== undefined) {
    if (
      typeof scan.dashboard_display_days !== 'number' ||
      !Number.isInteger(scan.dashboard_display_days) ||
      scan.dashboard_display_days < 1
    ) {
      errors.push('scan.dashboard_display_days must be an integer greater than 0 when provided');
    }
  }

  if (!assertObject(impact.prevalence_rates, 'impact.prevalence_rates', errors)) {
    return { valid: false, errors };
  }

  if (Object.keys(impact.prevalence_rates).length === 0) {
    errors.push('impact.prevalence_rates must define at least one disability category');
  }

  for (const [key, rate] of Object.entries(impact.prevalence_rates)) {
    assertNumberInRange(rate, `impact.prevalence_rates.${key}`, 0, 1, errors);
  }

  if (!assertObject(impact.severity_weights, 'impact.severity_weights', errors)) {
    return { valid: false, errors };
  }

  for (const severity of REQUIRED_SEVERITIES) {
    if (!(severity in impact.severity_weights)) {
      errors.push(`impact.severity_weights.${severity} is required`);
      continue;
    }
    assertNumberInRange(impact.severity_weights[severity], `impact.severity_weights.${severity}`, 0, 1, errors);
  }

  assertNumberInRange(impact.fallback_severity_weight, 'impact.fallback_severity_weight', 0, 1, errors);

  if (config.sources) {
    if (typeof config.sources !== 'object' || Array.isArray(config.sources)) {
      errors.push('sources must be a plain object when provided (arrays are not allowed)');
    } else {
      const { dap_top_pages_endpoints, dap_top_pages_endpoint } = config.sources;

      if (dap_top_pages_endpoints !== undefined) {
        if (!Array.isArray(dap_top_pages_endpoints) || dap_top_pages_endpoints.length === 0) {
          errors.push('sources.dap_top_pages_endpoints must be a non-empty array when provided');
        } else if (dap_top_pages_endpoints.some((ep) => typeof ep !== 'string' || ep.trim() === '')) {
          errors.push('sources.dap_top_pages_endpoints must contain only non-empty strings');
        }
      }

      if (dap_top_pages_endpoint !== undefined && typeof dap_top_pages_endpoint !== 'string') {
        errors.push('sources.dap_top_pages_endpoint must be a string when provided');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
