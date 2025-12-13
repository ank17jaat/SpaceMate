import React, { useState } from "react";
import { useUser } from "@/lib/clerk";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useEffect, useRef } from "react";

export default function AddWorkplaceForm() {
  const { user } = useUser();
  const ownerId = user?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [locationVal, setLocationVal] = useState("");
  
  const [images, setImages] = useState("");
  const defaultAmenities = ['WiFi','Parking','Meeting Rooms','Coffee','24/7 Access','Printer','Kitchen','Lounge'];
  const [availableAmenities, setAvailableAmenities] = useState<string[]>(defaultAmenities);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState<string>("");
  const amenitiesRef = useRef<HTMLDivElement | null>(null);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) {
      toast({ title: "Not signed in", description: "Please sign in to add a workplace." });
      return;
    }

    setLoading(true);
    try {
      const body = {
        ownerId,
        title,
        description,
        price: Number(price),
        location: locationVal,
        amenities: selectedAmenities,
        images: images ? images.split(",").map(i => i.trim()).filter(Boolean) : [],
        availableFrom: availableFrom || undefined,
        availableTo: availableTo || undefined,
      };

      // Forward to new properties endpoint
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed");
      }

      toast({ title: "Office space added", description: "Your office space was added successfully." });
      setLocation("/my-office-spaces");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add workplace" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch available amenities from server (merge with defaults)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/amenities');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data?.amenities)) {
          setAvailableAmenities((prev) => Array.from(new Set([...defaultAmenities, ...prev, ...data.amenities])));
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, []);

  const toggleAmenity = (a: string) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  const onSelectAmenity = (value: string) => {
    if (!value) return;
    if (!selectedAmenities.includes(value)) {
      setSelectedAmenities(prev => [...prev, value]);
    }
    setSelectValue("");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto p-6 space-y-6 bg-card rounded-md border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="price">Price (INR ₹)</Label>
          <Input id="price" required type="number" value={price} onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value)) as any} className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" required value={description} onChange={e => setDescription(e.target.value)} className="mt-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" required value={locationVal} onChange={e => setLocationVal(e.target.value)} className="mt-1" />
        </div>
        <div className="relative">
          <Label htmlFor="amenities">Amenities</Label>
          <div className="mt-1 grid grid-cols-1 gap-2">
            <Select value={selectValue} onValueChange={onSelectAmenity}>
              <SelectTrigger>
                <SelectValue placeholder="Select an amenity" />
              </SelectTrigger>
              <SelectContent>
                {availableAmenities.map((a) => (
                  <SelectItem key={a} value={a} disabled={selectedAmenities.includes(a)}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2">
              {selectedAmenities.map(a => (
                <Badge key={a} variant="secondary" className="flex items-center gap-2">
                  {a}
                  <button type="button" onClick={() => toggleAmenity(a)} className="ml-2 text-xs">✕</button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="images">Images (comma separated URLs)</Label>
        <Input id="images" placeholder="https://... , https://..." value={images} onChange={e => setImages(e.target.value)} className="mt-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="availableFrom">Available From</Label>
          <Input id="availableFrom" type="date" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="availableTo">Available To</Label>
          <Input id="availableTo" type="date" value={availableTo} onChange={e => setAvailableTo(e.target.value)} className="mt-1" />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" variant="secondary" disabled={loading}>{loading ? "Saving..." : "Add Workplace"}</Button>
      </div>
    </form>
  );
}
