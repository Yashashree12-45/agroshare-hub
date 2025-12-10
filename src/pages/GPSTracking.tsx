import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Navigation, Clock, Fuel, Phone, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import 'leaflet/dist/leaflet.css';

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

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const GPSTracking = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking') || 'BK-2024-001';
  
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(true);

  const currentPosition = routePoints[currentPointIndex];
  const destination = routePoints[routePoints.length - 1];
  const traveledPath = routePoints.slice(0, currentPointIndex + 1);
  const remainingPath = routePoints.slice(currentPointIndex);

  const totalDistance = 8.5; // km
  const distanceCovered = ((currentPointIndex / (routePoints.length - 1)) * totalDistance).toFixed(1);
  const remainingDistance = (totalDistance - parseFloat(distanceCovered)).toFixed(1);
  const estimatedTime = Math.ceil((routePoints.length - 1 - currentPointIndex) * 5);

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
          <div className="flex items-center justify-between">
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
              className="text-sm"
            >
              {mockEquipment.status === 'Arrived' ? t('tracking.arrived') : t('tracking.inTransit')}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="h-[500px]">
                  <MapContainer
                    center={currentPosition}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater center={currentPosition} />
                    
                    {/* Traveled path */}
                    <Polyline
                      positions={traveledPath}
                      color="hsl(var(--primary))"
                      weight={4}
                      opacity={0.8}
                    />
                    
                    {/* Remaining path */}
                    <Polyline
                      positions={remainingPath}
                      color="hsl(var(--muted-foreground))"
                      weight={3}
                      dashArray="10, 10"
                      opacity={0.5}
                    />
                    
                    {/* Equipment marker */}
                    <Marker position={currentPosition} icon={tractorIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>{mockEquipment.name}</strong>
                          <br />
                          <span className="text-sm">Operator: {mockEquipment.operator.name}</span>
                        </div>
                      </Popup>
                    </Marker>
                    
                    {/* Destination marker */}
                    <Marker position={destination} icon={destinationIcon}>
                      <Popup>Your Field Location</Popup>
                    </Marker>
                  </MapContainer>
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
                    <Fuel className="h-6 w-6 mx-auto mb-1 text-accent" />
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
