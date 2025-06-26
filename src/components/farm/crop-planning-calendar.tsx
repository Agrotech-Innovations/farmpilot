import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Calendar, MapPin, Sprout, Clock} from 'lucide-react';

interface CropPlan {
  id: string;
  cropName: string;
  variety: string;
  fieldName: string;
  plantingDate: Date;
  expectedHarvestDate: Date;
  status: 'planned' | 'planted' | 'growing' | 'harvested';
  acres: number;
}

interface Field {
  id: string;
  name: string;
  acres: number;
  soilType: string;
}

interface CropPlanningCalendarProps {
  crops: CropPlan[];
  fields: Field[];
  onUpdateCropPlan: (cropPlan: CropPlan) => void;
  onCreateCropPlan: (fieldId: string, date: Date) => void;
}

export function CropPlanningCalendar({
  crops,
  fields,
  onUpdateCropPlan,
  onCreateCropPlan
}: CropPlanningCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedField, setSelectedField] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'planted':
        return 'bg-green-100 text-green-800';
      case 'growing':
        return 'bg-yellow-100 text-yellow-800';
      case 'harvested':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentSeasonCrops = () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    return crops.filter(
      (crop) =>
        crop.plantingDate >= threeMonthsAgo &&
        crop.plantingDate <= threeMonthsLater
    );
  };

  const getUpcomingPlantings = () => {
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return crops.filter(
      (crop) =>
        crop.plantingDate >= now &&
        crop.plantingDate <= nextMonth &&
        crop.status === 'planned'
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header with quick actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Crop Planning Calendar
          </h2>
          <p className="text-gray-600">
            Plan and track your crop rotations and planting schedules
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Sprout className="w-4 h-4 mr-2" />
          Plan New Crop
        </Button>
      </div>

      {/* Current Season Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planting Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Current Season Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getCurrentSeasonCrops().map((crop) => (
                <div
                  key={crop.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onUpdateCropPlan(crop)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div>
                      <h4 className="font-medium">
                        {crop.cropName} - {crop.variety}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {crop.fieldName}
                        </span>
                        <span>{crop.acres} acres</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(crop.status)}>
                      {crop.status}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      Plant: {formatDate(crop.plantingDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Plantings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingPlantings().map((crop) => (
                <div key={crop.id} className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">{crop.cropName}</h4>
                  <p className="text-sm text-blue-700">{crop.fieldName}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Due: {formatDate(crop.plantingDate)}
                  </p>
                </div>
              ))}
              {getUpcomingPlantings().length === 0 && (
                <p className="text-gray-500 text-sm">
                  No upcoming plantings scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Field Layout & Current Crops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => {
              const fieldCrops = crops.filter(
                (crop) =>
                  crop.fieldName === field.name &&
                  ['planted', 'growing'].includes(crop.status)
              );

              return (
                <div
                  key={field.id}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors cursor-pointer"
                  onClick={() => onCreateCropPlan(field.id, new Date())}
                >
                  <h3 className="font-semibold text-gray-900">{field.name}</h3>
                  <p className="text-sm text-gray-600">
                    {field.acres} acres • {field.soilType}
                  </p>

                  {fieldCrops.length > 0 ? (
                    <div className="mt-2 space-y-1">
                      {fieldCrops.map((crop) => (
                        <div key={crop.id} className="text-sm">
                          <span className="font-medium text-green-700">
                            {crop.cropName}
                          </span>
                          <Badge
                            className={`ml-2 ${getStatusColor(crop.status)}`}
                          >
                            {crop.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-500">
                      Available for planting
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
