import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Navigation, Clock, Fuel, Phone, MapPin, RefreshCw, Truck, Play, Pause, SkipBack, SkipForward, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Simulated route points
const routePoints: [number, number][] = [
  [18.5204, 73.8567],
  [18.5250, 73.8600],
  [18.5300, 73.8650],
  [18.5350, 73.8700],
  [18.5400, 73.8750],
  [18.5450, 73.8800],
  [18.5500, 73.8850],
];

// Route history mock data
const routeHistory = [
  {
    id: '1',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '11:30',
    distance: 8.5,
    route: routePoints,
    equipment: 'John Deere 5310',
  },
  {
    id: '2',
    date: '2024-01-12',
    startTime: '14:00',
    endTime: '16:45',
    distance: 12.3,
    route: routePoints.map(([lat, lng]) => [lat + 0.01, lng + 0.01] as [number, number]),
    equipment: 'Mahindra Tractor',
  },
  {
    id: '3',
    date: '2024-01-08',
    startTime: '07:30',
    endTime: '10:00',
    distance: 6.2,
    route: routePoints.map(([lat, lng]) => [lat - 0.005, lng + 0.02] as [number, number]),
    equipment: 'John Deere 5310',
  },
];

const GPSTracking = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking') || 'BK-2024-001';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isPlayback, setIsPlayback] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedHistory, setSelectedHistory] = useState<typeof routeHistory[0] | null>(null);
  const [activeTab, setActiveTab] = useState('live');

  const currentRoute = selectedHistory?.route || routePoints;
  const currentPosition = currentRoute[currentPointIndex];
  const totalDistance = selectedHistory?.distance || 8.5;
  const distanceCovered = ((currentPointIndex / (currentRoute.length - 1)) * totalDistance).toFixed(1);
  const remainingDistance = (totalDistance - parseFloat(distanceCovered)).toFixed(1);
  const estimatedTime = Math.ceil((currentRoute.length - 1 - currentPointIndex) * 5);
  const progress = (currentPointIndex / (currentRoute.length - 1)) * 100;

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

        const map = L.map(mapContainerRef.current).setView(currentPosition, 14);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

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

  // Update map layers
  const updateMapLayers = useCallback(async () => {
    if (!mapRef.current || !mapLoaded) return;
    
    const L = await import('leaflet');
    const map = mapRef.current;
    
    // Clear existing markers and polylines
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline) {
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
    const traveledPath = L.polyline(currentRoute.slice(0, currentPointIndex + 1), {
      color: '#2E7D32',
      weight: 4,
      opacity: 0.8
    }).addTo(map);
    markersRef.current.push(traveledPath);

    // Add remaining path
    const remainingPath = L.polyline(currentRoute.slice(currentPointIndex), {
      color: '#9CA3AF',
      weight: 3,
      dashArray: '10, 10',
      opacity: 0.5
    }).addTo(map);
    markersRef.current.push(remainingPath);

    // Add markers
    const tractorMarker = L.marker(currentPosition, { icon: tractorIcon }).addTo(map);
    const destMarker = L.marker(currentRoute[currentRoute.length - 1], { icon: destinationIcon }).addTo(map);
    markersRef.current.push(tractorMarker, destMarker);

    map.setView(currentPosition, 14);
  }, [currentPointIndex, mapLoaded, currentRoute, currentPosition]);

  useEffect(() => {
    updateMapLayers();
  }, [updateMapLayers]);

  // Real-time polling simulation
  useEffect(() => {
    if (!isLiveTracking || isPlayback || activeTab !== 'live') return;
    if (currentPointIndex >= routePoints.length - 1) return;

    const pollInterval = setInterval(() => {
      setCurrentPointIndex((prev) => {
        if (prev >= routePoints.length - 1) {
          setIsLiveTracking(false);
          return prev;
        }
        return prev + 1;
      });
      setLastUpdated(new Date());
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [isLiveTracking, currentPointIndex, isPlayback, activeTab]);

  // Playback animation
  useEffect(() => {
    if (!isPlayback) return;

    const playbackInterval = setInterval(() => {
      setCurrentPointIndex((prev) => {
        if (prev >= currentRoute.length - 1) {
          setIsPlayback(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(playbackInterval);
  }, [isPlayback, playbackSpeed, currentRoute.length]);

  const mockEquipment = {
    name: selectedHistory?.equipment || 'John Deere 5310',
    type: 'Tractor',
    operator: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      rating: 4.8,
    },
    status: currentPointIndex >= currentRoute.length - 1 ? 'Arrived' : 'In Transit',
    fuelLevel: 75,
  };

  const handleHistorySelect = (history: typeof routeHistory[0]) => {
    setSelectedHistory(history);
    setCurrentPointIndex(0);
    setIsPlayback(false);
    setActiveTab('playback');
  };

  const resetToLive = () => {
    setSelectedHistory(null);
    setCurrentPointIndex(0);
    setIsLiveTracking(true);
    setIsPlayback(false);
    setActiveTab('live');
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
            <div className="flex items-center gap-2">
              <Badge 
                variant={mockEquipment.status === 'Arrived' ? 'default' : 'secondary'}
                className="text-sm px-4 py-2"
              >
                <Truck className="h-4 w-4 mr-2" />
                {mockEquipment.status === 'Arrived' ? t('tracking.arrived') : t('tracking.inTransit')}
              </Badge>
              {activeTab === 'live' && (
                <span className="text-xs text-muted-foreground">
                  {t('tracking.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="live" onClick={resetToLive}>
                <Navigation className="h-4 w-4 mr-2" />
                {t('tracking.liveTracking')}
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                {t('tracking.routeHistory')}
              </TabsTrigger>
              <TabsTrigger value="playback" disabled={!selectedHistory}>
                <Play className="h-4 w-4 mr-2" />
                {t('tracking.playback')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="mt-4">
              {/* Progress Bar */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{distanceCovered} km {t('tracking.covered')}</span>
                    <span>{remainingDistance} km {t('tracking.remaining')}</span>
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

                  <Button 
                    className="w-full"
                    onClick={() => {
                      setCurrentPointIndex(0);
                      setIsLiveTracking(true);
                      setLastUpdated(new Date());
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('tracking.refresh')}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routeHistory.map((history) => (
                  <Card 
                    key={history.id} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleHistorySelect(history)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold">{history.equipment}</p>
                          <p className="text-sm text-muted-foreground">{history.date}</p>
                        </div>
                        <Badge variant="outline">{history.distance} km</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{history.startTime} - {history.endTime}</span>
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4 mr-1" />
                          {t('tracking.playback')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="playback" className="mt-4">
              {selectedHistory && (
                <>
                  {/* Playback Controls */}
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-semibold">{selectedHistory.equipment}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedHistory.date} | {selectedHistory.startTime} - {selectedHistory.endTime}
                          </p>
                        </div>
                        <Badge>{selectedHistory.distance} km</Badge>
                      </div>
                      
                      <Slider 
                        value={[currentPointIndex]}
                        max={currentRoute.length - 1}
                        step={1}
                        onValueChange={(value) => setCurrentPointIndex(value[0])}
                        className="mb-4"
                      />
                      
                      <div className="flex items-center justify-center gap-4">
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => setCurrentPointIndex(0)}
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon"
                          onClick={() => setIsPlayback(!isPlayback)}
                        >
                          {isPlayback ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => setCurrentPointIndex(currentRoute.length - 1)}
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-sm text-muted-foreground">{t('tracking.speed')}:</span>
                          {[0.5, 1, 2].map((speed) => (
                            <Button
                              key={speed}
                              size="sm"
                              variant={playbackSpeed === speed ? 'default' : 'outline'}
                              onClick={() => setPlaybackSpeed(speed)}
                            >
                              {speed}x
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Map for playback */}
                  <Card className="overflow-hidden">
                    <div className="h-[500px] relative">
                      {!mapLoaded ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : null}
                      <div 
                        ref={mapContainerRef} 
                        className="h-full w-full"
                        style={{ zIndex: 1 }}
                      />
                    </div>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default GPSTracking;
