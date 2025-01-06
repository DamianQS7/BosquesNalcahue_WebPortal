import { ChartEvent } from "chart.js";

export interface ChartsEventsArgs {
  event?: ChartEvent;
  active?: object[];
}