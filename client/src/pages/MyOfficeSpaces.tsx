import React, { useEffect, useState } from "react";
import { useUser } from "@/lib/clerk";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function MyOfficeSpaces() {
  const { user } = useUser();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMy = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties?ownerId=${user?.id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setItems(data || []);
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to load office spaces" });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMy();
  }, [user]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Office Spaces</h1>
      {loading && <div>Loading...</div>}
      {!loading && items.length === 0 && <div>No office spaces yet.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {items.map((it) => (
          <Card key={it._id} className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-start">
              <div className="md:col-span-1">
                <img
                  src={it.images && it.images.length > 0 ? it.images[0] : '/placeholder.png'}
                  alt={it.name || it.title}
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-lg">{it.name || it.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{it.description}</p>
                    <div className="mt-2 text-sm">Location: {it.location || it.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">₹{it.price}</div>
                    <Badge variant="outline" className="mt-2">{it.availableFrom ? 'Available' : 'Listed'}</Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/property/${it._id}`}>
                    <button className="px-3 py-2 border rounded">View</button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
