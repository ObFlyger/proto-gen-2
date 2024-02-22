import { LayerSpecification } from "maplibre-gl";
import { Theme } from "../types/theme";
import { labels_layers, nolabels_layers } from "./base-layer";

export default function create_layers(
  source: string,
  theme: Theme
): LayerSpecification[] {
  return nolabels_layers(source, theme).concat(labels_layers(source, theme));
}

export function noLabels(source: string, theme: Theme) {
  return nolabels_layers(source, theme);
}

export function labels(source: string, theme: Theme) {
  return labels_layers(source, theme);
}
