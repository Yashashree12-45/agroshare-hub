import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Navigation, Clock, Fuel, Phone, MapPin, RefreshCw, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Simulated route points
const routePoints: [number, number][] = [
  [18.5204, 73.8567], // Start - Pune
  [18.5250, 73.8600],
  [18.5300, 73.8650],
  [18.5350, 73.8700],
  [18.5400, 73.8750],
  [18.5450, 73.8800],
  [18.5500, 73.8850], // Destination
];

const GPSTracking = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking') || 'BK-2024-001';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const currentPosition = routePoints[currentPointIndex];
  const totalDistance = 8.5; // km
  const distanceCovered = ((currentPointIndex / (routePoints.length - 1)) * totalDistance).toFixed(1);
  const remainingDistance = (totalDistance - parseFloat(distanceCovered)).toFixed(1);
  const estimatedTime = Math.ceil((routePoints.length - 1 - currentPointIndex) * 5);
  const progress = (currentPointIndex / (routePoints.length - 1)) * 100;

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        
        if (!mapContainerRef.current || mapRef.current) return;

        // Fix leaflet marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const tractorIcon = new L.Icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });

        const destinationIcon = new L.Icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [35, 35],
          iconAnchor: [17, 35],
          popupAnchor: [0, -35],
        });

        const map = L.map(mapContainerRef.current).setView(currentPosition, 14);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add traveled path
        L.polyline(routePoints.slice(0, currentPointIndex + 1), {
          color: '#2E7D32',
          weight: 4,
          opacity: 0.8
        }).addTo(map);

        // Add remaining path
        L.polyline(routePoints.slice(currentPointIndex), {
          color: '#9CA3AF',
          weight: 3,
          dashArray: '10, 10',
          opacity: 0.5
        }).addTo(map);

        // Add equipment marker
        L.marker(currentPosition, { icon: tractorIcon })
          .addTo(map)
          .bindPopup('<strong>John Deere 5310</strong><br/>Operator: Rajesh Kumar');

        // Add destination marker
        L.marker(routePoints[routePoints.length - 1], { icon: destinationIcon })
          .addTo(map)
          .bindPopup('Your Field Location');

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
  }, []);

  // Update map when position changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    const L = require('leaflet');
    const map = mapRef.current;
    
    // Clear existing layers except tile layer
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const tractorIcon = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    const destinationIcon = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35],
    });

    // Add traveled path
    L.polyline(routePoints.slice(0, currentPointIndex + 1), {
      color: '#2E7D32',
      weight: 4,
      opacity: 0.8
    }).addTo(map);

    // Add remaining path
    L.polyline(routePoints.slice(currentPointIndex), {
      color: '#9CA3AF',
      weight: 3,
      dashArray: '10, 10',
      opacity: 0.5
    }).addTo(map);

    // Add markers
    L.marker(currentPosition, { icon: tractorIcon }).addTo(map);
    L.marker(routePoints[routePoints.length - 1], { icon: destinationIcon }).addTo(map);

    map.setView(currentPosition, 14);
  }, [currentPointIndex, mapLoaded]);

  // Simulate movement
  useEffect(() => {
    if (!isMoving || currentPointIndex >= routePoints.length - 1) return;

    const interval = setInterval(() => {
      setCurrentPointIndex((prev) => {
        if (prev >= routePoints.length - 1) {
          setIsMoving(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isMoving, currentPointIndex]);

  const mockEquipment = {
    name: 'John Deere 5310',
    type: 'Tractor',
    operator: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      rating: 4.8,
    },
    status: currentPointIndex >= routePoints.length - 1 ? 'Arrived' : 'In Transit',
    fuelLevel: 75,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t('tracking.title')}</h1>
                <p className="text-muted-foreground">{t('tracking.booking')}: {bookingId}</p>
              </div>
            </div>
            <Badge 
              variant={mockEquipment.status === 'Arrived' ? 'default' : 'secondary'}
              className="text-sm px-4 py-2"
            >
              <Truck className="h-4 w-4 mr-2" />
              {mockEquipment.status === 'Arrived' ? t('tracking.arrived') : t('tracking.inTransit')}
            </Badge>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{t('tracking.distanceLeft')}: {distanceCovered} km</span>
                <span>{remainingDistance} km {t('tracking.distanceLeft').toLowerCase()}</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="h-[500px] relative">
                  {mapError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50">
                      <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center px-4">
                        {t('tracking.title')} - {mockEquipment.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Location: Pune, Maharashtra
                      </p>
                      <p className="text-primary font-semibold mt-4">
                        {distanceCovered} km / {totalDistance} km
                      </p>
                    </div>
                  ) : !mapLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
                      </div>
                    </div>
                  ) : null}
                  <div 
                    ref={mapContainerRef} 
                    className="h-full w-full"
                    style={{ zIndex: 1 }}
                  />
                </div>
              </Card>
            </div>

            {/* Info Panel */}
            <div className="space-y-4">
              {/* ETA Card */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-80" />
                    <p className="text-sm opacity-80">{t('tracking.estimatedArrival')}</p>
                    <p className="text-3xl font-bold">
                      {mockEquipment.status === 'Arrived' ? t('tracking.arrived') : `${estimatedTime} min`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Distance & Fuel */}
              <Card>
                <CardContent className="pt-6 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Navigation className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">{t('tracking.distanceLeft')}</p>
                    <p className="text-lg font-semibold">{remainingDistance} km</p>
                  </div>
                  <div className="text-center">
                    <Fuel className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">{t('tracking.fuelLevel')}</p>
                    <p className="text-lg font-semibold">{mockEquipment.fuelLevel}%</p>
                  </div>
                </CardContent>
              </Card>

              {/* Equipment Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('tracking.equipmentDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('tracking.name')}</span>
                    <span className="font-medium">{mockEquipment.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('tracking.type')}</span>
                    <span className="font-medium">{mockEquipment.type}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Operator Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('tracking.operator')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {mockEquipment.operator.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{mockEquipment.operator.name}</p>
                      <p className="text-sm text-muted-foreground">⭐ {mockEquipment.operator.rating}</p>
                    </div>
                    <Button size="icon" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setCurrentPointIndex(0);
                    setIsMoving(true);
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('tracking.refresh')}
                </Button>
                <Button className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('tracking.shareLocation')}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default GPSTracking;
