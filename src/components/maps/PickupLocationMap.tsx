import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Phone, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PickupLocationMapProps {
  ownerLocation: {
    lat: number;
    lng: number;
    village: string;
    district: string;
    state: string;
  };
  ownerName: string;
  ownerPhone?: string;
}

export function PickupLocationMap({ ownerLocation, ownerName, ownerPhone }: PickupLocationMapProps) {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
          
          const dist = calculateDistance(
            userLoc.lat,
            userLoc.lng,
            ownerLocation.lat,
            ownerLocation.lng
          );
          setDistance(dist);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, [ownerLocation]);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        if (!mapContainerRef.current || mapRef.current) return;

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const map = L.map(mapContainerRef.current).setView(
          [ownerLocation.lat, ownerLocation.lng],
          14
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Owner location marker
        const ownerIcon = new L.Icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [35, 35],
          iconAnchor: [17, 35],
          popupAnchor: [0, -35],
        });

        const ownerMarker = L.marker([ownerLocation.lat, ownerLocation.lng], {
          icon: ownerIcon,
        }).addTo(map);

        ownerMarker.bindPopup(`
          <div class="text-center p-2">
            <strong>${ownerName}</strong><br/>
            <span class="text-sm">${ownerLocation.village}, ${ownerLocation.district}</span>
          </div>
        `).openPopup();

        // Add user location marker if available
        if (userLocation) {
          const userIcon = new L.Icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });

          L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);

          // Draw route line
          const routeLine = L.polyline(
            [
              [userLocation.lat, userLocation.lng],
              [ownerLocation.lat, ownerLocation.lng],
            ],
            {
              color: '#2E7D32',
              weight: 3,
              dashArray: '10, 10',
              opacity: 0.7,
            }
          ).addTo(map);

          // Fit bounds to show both markers
          const bounds = L.latLngBounds([
            [userLocation.lat, userLocation.lng],
            [ownerLocation.lat, ownerLocation.lng],
          ]);
          map.fitBounds(bounds, { padding: [50, 50] });
        }

        mapRef.current = map;
        setMapLoaded(true);
      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError(true);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [ownerLocation, ownerName, userLocation]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${ownerLocation.lat},${ownerLocation.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-3">
      {/* Map */}
      <Card className="overflow-hidden">
        <div className="h-[200px] relative">
          {mapError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50">
              <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                {ownerLocation.village}, {ownerLocation.district}
              </p>
            </div>
          ) : !mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : null}
          <div ref={mapContainerRef} className="h-full w-full" style={{ zIndex: 1 }} />
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">{t('maps.distance')}</p>
            <p className="font-semibold text-sm">
              {distance ? `${distance.toFixed(1)} km` : '--'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Navigation className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">{t('maps.travelTime')}</p>
            <p className="font-semibold text-sm">
              {distance ? `~${Math.ceil(distance * 2.5)} ${t('booking.minutes')}` : '--'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={openInGoogleMaps}>
          <ExternalLink className="h-4 w-4 mr-2" />
          {t('maps.getDirections')}
        </Button>
        {ownerPhone && (
          <Button variant="outline" size="icon" asChild>
            <a href={`tel:${ownerPhone}`}>
              <Phone className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
