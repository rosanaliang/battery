import { PropertyConfig, DeveloperPropertyConfig } from './property-config';
import { Plugin } from './plugin-config';

export interface BatteryConfig {
  props: PropertyConfig[];
  plugins?: Plugin[];
}

export interface DeveloperBatteryConfig {
  props: DeveloperPropertyConfig[];
  plugins?: Plugin[];
}
