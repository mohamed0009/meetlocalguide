"use client";

import { MapPin, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
    GeoJSONSource,
    LngLatBoundsLike,
    Map as MapboxMap,
    MapLayerMouseEvent,
} from "mapbox-gl";
import { formatMad, type Experience } from "@/lib/experiences";
import { cn } from "@/lib/utils";

const SOURCE_ID = "experiences-source";
const CLUSTER_LAYER_ID = "experiences-clusters";
const CLUSTER_COUNT_LAYER_ID = "experiences-cluster-count";
const POINT_LAYER_ID = "experiences-point";
const ACTIVE_POINT_LAYER_ID = "experiences-point-active";

const MOROCCO_BOUNDS: LngLatBoundsLike = [
    [-13.3, 27.5],
    [-0.95, 36],
];

type ExperienceFeatureCollection = GeoJSON.FeatureCollection<
    GeoJSON.Point,
    {
        experienceId: string;
        title: string;
        city: string;
        priceMad: number;
        rating: number;
    }
>;

type ExperiencesMapProps = {
    experiences: Experience[];
    selectedExperienceId: string | null;
    hoveredExperienceId: string | null;
    onSelectExperience: (experienceId: string) => void;
    onHoverExperience: (experienceId: string | null) => void;
};

function toFeatureCollection(items: Experience[]): ExperienceFeatureCollection {
    return {
        type: "FeatureCollection",
        features: items.map((item) => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [item.coordinates.lng, item.coordinates.lat],
            },
            properties: {
                experienceId: item.id,
                title: item.title,
                city: item.city,
                priceMad: item.priceMad,
                rating: item.rating,
            },
        })),
    };
}

export default function ExperiencesMap({
    experiences,
    selectedExperienceId,
    hoveredExperienceId,
    onSelectExperience,
    onHoverExperience,
}: ExperiencesMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapboxMap | null>(null);
    const onSelectRef = useRef(onSelectExperience);
    const onHoverRef = useRef(onHoverExperience);
    const [isMapReady, setIsMapReady] = useState(false);

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const featureCollection = useMemo(() => toFeatureCollection(experiences), [experiences]);

    const previewExperience = useMemo(() => {
        if (hoveredExperienceId) {
            return experiences.find((item) => item.id === hoveredExperienceId) ?? null;
        }
        if (selectedExperienceId) {
            return experiences.find((item) => item.id === selectedExperienceId) ?? null;
        }
        return experiences[0] ?? null;
    }, [experiences, hoveredExperienceId, selectedExperienceId]);

    const activeExperienceIds = useMemo(() => {
        const ids = [selectedExperienceId, hoveredExperienceId].filter(
            (item): item is string => Boolean(item)
        );
        return Array.from(new Set(ids));
    }, [hoveredExperienceId, selectedExperienceId]);

    const featureCollectionRef = useRef(featureCollection);
    const activeExperienceIdsRef = useRef(activeExperienceIds);

    useEffect(() => { featureCollectionRef.current = featureCollection; }, [featureCollection]);
    useEffect(() => { activeExperienceIdsRef.current = activeExperienceIds; }, [activeExperienceIds]);
    useEffect(() => { onSelectRef.current = onSelectExperience; }, [onSelectExperience]);
    useEffect(() => { onHoverRef.current = onHoverExperience; }, [onHoverExperience]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current || !token) return;

        let active = true;

        const initializeMap = async () => {
            const mapboxModule = await import("mapbox-gl");
            const mapboxgl = mapboxModule.default;

            if (!active || !mapContainerRef.current) return;

            mapboxgl.accessToken = token;

            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/light-v11",
                center: [-7.5, 31.8],
                zoom: 5.3,
                maxBounds: MOROCCO_BOUNDS,
                attributionControl: false,
            });

            mapRef.current = map;

            map.on("load", () => {
                if (!active) return;

                map.addSource(SOURCE_ID, {
                    type: "geojson",
                    data: featureCollectionRef.current,
                    cluster: true,
                    clusterRadius: 45,
                    clusterMaxZoom: 13,
                });

                /* Cluster circles — shades of red */
                map.addLayer({
                    id: CLUSTER_LAYER_ID,
                    type: "circle",
                    source: SOURCE_ID,
                    filter: ["has", "point_count"],
                    paint: {
                        "circle-color": [
                            "step",
                            ["get", "point_count"],
                            "#888888",   /* small cluster */
                            10, "#444444", /* medium */
                            25, "#000000", /* large */
                        ],
                        "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 25, 30],
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "rgba(0,0,0,0.4)",
                        "circle-opacity": 0.9,
                    },
                });

                /* Cluster count label */
                map.addLayer({
                    id: CLUSTER_COUNT_LAYER_ID,
                    type: "symbol",
                    source: SOURCE_ID,
                    filter: ["has", "point_count"],
                    layout: {
                        "text-field": ["get", "point_count_abbreviated"],
                        "text-size": 12,
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    },
                    paint: {
                        "text-color": "#ffffff",
                    },
                });

                /* Individual point — red dot */
                map.addLayer({
                    id: POINT_LAYER_ID,
                    type: "circle",
                    source: SOURCE_ID,
                    filter: ["!", ["has", "point_count"]],
                    paint: {
                        "circle-color": "#000000",
                        "circle-radius": 8,
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "rgba(255,255,255,0.3)",
                        "circle-opacity": 0.9,
                    },
                });

                /* Active/selected point — bright red with larger radius */
                map.addLayer({
                    id: ACTIVE_POINT_LAYER_ID,
                    type: "circle",
                    source: SOURCE_ID,
                    filter: ["in", ["get", "experienceId"], ["literal", activeExperienceIdsRef.current]],
                    paint: {
                        "circle-color": "#333333",
                        "circle-radius": 12,
                        "circle-stroke-width": 3,
                        "circle-stroke-color": "rgba(255,45,68,0.5)",
                        "circle-opacity": 1,
                    },
                });

                /* Cluster click → zoom in */
                map.on("click", CLUSTER_LAYER_ID, (event: MapLayerMouseEvent) => {
                    const clusterFeature = event.features?.[0];
                    if (!clusterFeature || clusterFeature.geometry.type !== "Point") return;

                    const clusterCoordinates = clusterFeature.geometry.coordinates as [number, number];
                    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
                    const clusterId = Number(clusterFeature.properties?.cluster_id);

                    if (!source || !Number.isFinite(clusterId)) return;

                    source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                        if (err || zoom == null) return;
                        map.easeTo({ center: clusterCoordinates, zoom, duration: 450 });
                    });
                });

                /* Individual point click */
                map.on("click", POINT_LAYER_ID, (event: MapLayerMouseEvent) => {
                    const feature = event.features?.[0];
                    if (!feature || feature.geometry.type !== "Point") return;

                    const selectedId = feature.properties?.experienceId;
                    if (typeof selectedId !== "string") return;

                    onSelectRef.current(selectedId);
                    map.easeTo({
                        center: feature.geometry.coordinates as [number, number],
                        zoom: Math.max(map.getZoom(), 7),
                        duration: 500,
                    });
                });

                map.on("mouseenter", POINT_LAYER_ID, (event: MapLayerMouseEvent) => {
                    map.getCanvas().style.cursor = "pointer";
                    const hoveredId = event.features?.[0]?.properties?.experienceId;
                    if (typeof hoveredId === "string") onHoverRef.current(hoveredId);
                });

                map.on("mouseleave", POINT_LAYER_ID, () => {
                    map.getCanvas().style.cursor = "";
                    onHoverRef.current(null);
                });

                map.on("mouseenter", CLUSTER_LAYER_ID, () => {
                    map.getCanvas().style.cursor = "pointer";
                });
                map.on("mouseleave", CLUSTER_LAYER_ID, () => {
                    map.getCanvas().style.cursor = "";
                });

                setIsMapReady(true);
            });
        };

        void initializeMap();

        return () => {
            active = false;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            setIsMapReady(false);
        };
    }, [token]);

    /* Update geojson data when experiences change */
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !map.getSource(SOURCE_ID)) return;
        const source = map.getSource(SOURCE_ID) as GeoJSONSource;
        source.setData(featureCollection);
    }, [featureCollection]);

    /* Update active filter when selection changes */
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !map.getLayer(ACTIVE_POINT_LAYER_ID)) return;
        map.setFilter(ACTIVE_POINT_LAYER_ID, [
            "in",
            ["get", "experienceId"],
            ["literal", activeExperienceIds],
        ]);
    }, [activeExperienceIds]);

    /* Pan to selected experience */
    useEffect(() => {
        if (!selectedExperienceId) return;
        const map = mapRef.current;
        if (!map || !isMapReady) return;
        const item = experiences.find((e) => e.id === selectedExperienceId);
        if (!item) return;
        map.easeTo({
            center: [item.coordinates.lng, item.coordinates.lat],
            zoom: Math.max(map.getZoom(), 6.8),
            duration: 550,
        });
    }, [experiences, isMapReady, selectedExperienceId]);

    /* No token configured */
    if (!token) {
        return (
            <div
                className="flex h-[58vh] min-h-[440px] items-center justify-center rounded-xl px-6 text-center"
                style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                }}
            >
                <div className="space-y-3">
                    <div
                        className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                    >
                        <MapPin className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                        Map not configured
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        Add{" "}
                        <code
                            className="rounded px-1.5 py-0.5 text-xs"
                            style={{ background: "var(--bg-surface)", color: "var(--accent)" }}
                        >
                            NEXT_PUBLIC_MAPBOX_TOKEN
                        </code>{" "}
                        to your environment to enable map exploration.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative h-[58vh] min-h-[440px] overflow-hidden rounded-xl"
            aria-label="Interactive experiences map"
        >
            <div ref={mapContainerRef} className="absolute inset-0" />

            {/* Loading overlay */}
            {!isMapReady && (
                <div
                    className="absolute inset-0 flex items-center justify-center rounded-xl"
                    style={{ background: "rgba(8,8,14,0.7)", backdropFilter: "blur(4px)" }}
                >
                    <div
                        className="h-8 w-8 animate-spin rounded-full border-2"
                        style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
                    />
                </div>
            )}

            {/* Preview card overlay */}
            {previewExperience && isMapReady && (
                <div
                    className={cn(
                        "absolute left-4 top-4 max-w-[270px] rounded-2xl p-3.5 transition-all duration-200"
                    )}
                    style={{
                        background: "rgba(8,8,14,0.85)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid var(--border-accent)",
                        boxShadow: "var(--shadow-glow)",
                    }}
                >
                    {/* Accent top line */}
                    <div
                        className="absolute -top-px left-4 right-4 h-px rounded-full"
                        style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                    />

                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                        Preview
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                        {previewExperience.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {previewExperience.city}
                        </span>
                        <span className="flex items-center gap-1 text-amber-400">
                            <Star className="h-3 w-3 fill-current" />
                            {previewExperience.rating.toFixed(1)}
                        </span>
                    </div>
                    <p
                        className="mt-2 text-base font-700"
                        style={{
                            color: "var(--accent)",
                            textShadow: "0 0 10px var(--accent-glow)",
                        }}
                    >
                        {formatMad(previewExperience.priceMad)}{" "}
                        <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                            / person
                        </span>
                    </p>
                </div>
            )}

            {/* Tip badge */}
            <div
                className="absolute bottom-4 right-4 rounded-full px-3 py-1.5 text-[11px] font-medium"
                style={{
                    background: "rgba(8,8,14,0.75)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                }}
            >
                Click clusters to zoom · select a marker to focus
            </div>
        </div>
    );
}
