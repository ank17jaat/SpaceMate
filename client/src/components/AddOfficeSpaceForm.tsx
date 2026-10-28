import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@/lib/clerk";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { metaApi, propertiesApi } from "@/lib/api";

export default function AddOfficeSpaceForm() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [images, setImages] = useState("");
  const defaultAmenities = ['WiFi', 'Parking', 'Meeting Rooms', 'Coffee', '24/7 Access', 'Printer', 'Kitchen', 'Lounge'];
  const [availableAmenities, setAvailableAmenities] = useState<string[]>(defaultAmenities);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Not signed in", description: "Please sign in to add an office space." });
      return;
    }

    setLoading(true);
    try {
      await propertiesApi.create(
        {
          title,
          description,
          price: Number(price),
          city,
          address: city,
          amenities: selectedAmenities,
          images: images ? images.split(",").map((image) => image.trim()).filter(Boolean) : [],
          type: "office",
          maxGuests: 1,
        },
        getToken,
      );

      toast({ title: "Office space added", description: "Your office space was added successfully." });
      setLocation("/my-office-spaces");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add office space" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await metaApi.listAmenities();
        if (!mounted) return;
        if (Array.isArray(data.amenities)) {
          setAvailableAmenities((prev) =>
            Array.from(new Set([...defaultAmenities, ...prev, ...data.amenities])),
          );
        }
      } catch (_error) {
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity],
    );
  };

  const onSelectAmenity = (value: string) => {
    if (!value) return;
    if (!selectedAmenities.includes(value)) {
      setSelectedAmenities((prev) => [...prev, value]);
    }
    setSelectValue("");
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto p-6 space-y-6 bg-card rounded-md border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="price">Price (INR)</Label>
          <Input
            id="price"
            required
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" required value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="amenities">Amenities</Label>
          <div className="mt-1 grid grid-cols-1 gap-2">
            <Select value={selectValue} onValueChange={onSelectAmenity}>
              <SelectTrigger>
                <SelectValue placeholder="Select an amenity" />
              </SelectTrigger>
              <SelectContent>
                {availableAmenities.map((amenity) => (
                  <SelectItem key={amenity} value={amenity} disabled={selectedAmenities.includes(amenity)}>
                    {amenity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2">
              {selectedAmenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="flex items-center gap-2">
                  {amenity}
                  <button type="button" onClick={() => toggleAmenity(amenity)} className="ml-2 text-xs">
                    x
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="images">Images (comma separated URLs)</Label>
        <Input
          id="images"
          placeholder="https://... , https://..."
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? "Saving..." : "Add Office Space"}
        </Button>
      </div>
    </form>
  );
}
