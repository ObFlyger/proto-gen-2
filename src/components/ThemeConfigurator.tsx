"use client";

import { Button, Card, Input, Typography } from "@mui/joy";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { useEffect, useState } from "react";
import Map from "react-map-gl/maplibre";
import { Theme } from "../types/theme";
import create_layers from "../utils/create-layer";

const initialThemeState = {
  background: "#cccccc",
  earth: "#e0e0e0",
  park_a: "#cfddd5",
  park_b: "#9cd3b4",
  hospital: "#e4dad9",
  industrial: "#d1dde1",
  school: "#e4ded7",
  wood_a: "#d0ded0",
  wood_b: "#a0d9a0",
  pedestrian: "#e3e0d4",
  scrub_a: "#cedcd7",
  scrub_b: "#99d2bb",
  glacier: "#e7e7e7",
  sand: "#e2e0d7",
  beach: "#e8e4d0",
  aerodrome: "#dadbdf",
  runway: "#e9e9ed",
  water: "#80deea",
  pier: "#e0e0e0",
  zoo: "#c6dcdc",
  military: "#dcdcdc",

  tunnel_other_casing: "#e0e0e0",
  tunnel_minor_casing: "#e0e0e0",
  tunnel_link_casing: "#e0e0e0",
  tunnel_medium_casing: "#e0e0e0",
  tunnel_major_casing: "#e0e0e0",
  tunnel_highway_casing: "#e0e0e0",
  tunnel_other: "#d5d5d5",
  tunnel_minor: "#d5d5d5",
  tunnel_link: "#d5d5d5",
  tunnel_medium: "#d5d5d5",
  tunnel_major: "#d5d5d5",
  tunnel_highway: "#d5d5d5",

  transit_pier: "#e0e0e0",
  buildings: "#cccccc",

  minor_service_casing: "#e0e0e0",
  minor_casing: "#e0e0e0",
  link_casing: "#e0e0e0",
  medium_casing: "#e0e0e0",
  major_casing_late: "#e0e0e0",
  highway_casing_late: "#e0e0e0",
  other: "#ebebeb",
  minor_service: "#ebebeb",
  minor_a: "#ebebeb",
  minor_b: "#ffffff",
  link: "#ffffff",
  medium: "#f5f5f5",
  major_casing_early: "#e0e0e0",
  major: "#ffffff",
  highway_casing_early: "#e0e0e0",
  highway: "#ffffff",

  railway: "#a7b1b3",
  boundaries: "#adadad",
  waterway_label: "#ffffff",

  bridges_other_casing: "#e0e0e0",
  bridges_minor_casing: "#e0e0e0",
  bridges_link_casing: "#e0e0e0",
  bridges_medium_casing: "#e0e0e0",
  bridges_major_casing: "#e0e0e0",
  bridges_highway_casing: "#e0e0e0",
  bridges_other: "#ebebeb",
  bridges_minor: "#ffffff",
  bridges_link: "#ffffff",
  bridges_medium: "#f0eded",
  bridges_major: "#f5f5f5",
  bridges_highway: "#ffffff",

  roads_label_minor: "#91888b",
  roads_label_minor_halo: "#ffffff",
  roads_label_major: "#938a8d",
  roads_label_major_halo: "#ffffff",
  ocean_label: "#ffffff",
  peak_label: "#7e9aa0",
  subplace_label: "#8f8f8f",
  subplace_label_halo: "#e0e0e0",
  city_circle: "#ffffff",
  city_circle_stroke: "#a3a3a3",
  city_label: "#5c5c5c",
  city_label_halo: "#e0e0e0",
  state_label: "#b3b3b3",
  state_label_halo: "#e0e0e0",
  country_label: "#a3a3a3",
};

const ThemeConfigurator = () => {
  const [theme, setTheme] = useState<Theme>(initialThemeState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheme((prevTheme) => ({
      ...prevTheme,
      [name]: value,
    }));
  };

  const exportConfig = () => {
    const parsedTheme = {
      version: 8,
      name: "CustomTheme",
      glyphs:
        "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
      sources: {
        protomaps: {
          type: "vector",
          url: "pmtiles://https://build.protomaps.com/20240221.pmtiles",
        },
      },
      layers: create_layers("basemap", theme),
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(parsedTheme, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "theme.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportPalette = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(theme, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "palette.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const loadPalette = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          const parsedTheme = JSON.parse(content);
          setTheme(parsedTheme);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  }, []);

  return (
    <>
      <Card
        sx={{
          maxHeight: "100vh",
          overflowY: "auto",
          width: "350px",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 99,
        }}
      >
        <Typography level="h2">Theme Configurator</Typography>
        <Button onClick={exportPalette}>Export Palette</Button>
        <Input type="file" onChange={loadPalette} />
        {Object.entries(theme).map(([key, value]) => (
          <div key={key}>
            <label>{key}:</label>
            <Input
              type="color"
              name={key}
              value={value}
              onChange={handleChange}
            />
          </div>
        ))}
        <Button onClick={exportConfig}>Export Configuration</Button>
      </Card>

      <Map
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 0,
        }}
        style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
        mapStyle={{
          version: 8,
          name: "Light",
          glyphs:
            "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
          sources: {
            protomaps: {
              type: "vector",
              url: "pmtiles://https://build.protomaps.com/20240221.pmtiles",
            },
          },
          layers: create_layers("protomaps", theme),
        }}
      />
    </>
  );
};

export default ThemeConfigurator;
