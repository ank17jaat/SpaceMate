import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@/lib/clerk";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Link } from "wouter";
import { propertiesApi } from "@/lib/api";

export default function MyOfficeSpaces() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMy = async () => {
      setLoading(true);
      try {
        const data = await propertiesApi.listMine(getToken);
        setItems(data || []);
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to load office spaces" });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMy();
  }, [getToken, toast, user]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Office Spaces</h1>
      {loading && <div>Loading...</div>}
      {!loading && items.length === 0 && <div>No office spaces yet.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {items.map((it) => (
          <Card key={it.id} className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-start">
              <div className="md:col-span-1">
                <img
                  src={it.images && it.images.length > 0 ? it.images[0] : '/placeholder.png'}
                  alt={it.title}
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-lg">{it.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{it.description}</p>
                    <div className="mt-2 text-sm">Location: {it.address || it.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">INR {it.price}</div>
                    <Badge variant="outline" className="mt-2">Listed</Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/property/${it.id}`}>
                    <button className="px-3 py-2 border rounded">View</button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      try {
                        if (!confirm('Are you sure you want to delete this property?')) return;
                        await propertiesApi.remove(it.id, getToken);
                        setItems((prev) => prev.filter((property) => property.id !== it.id));
                        toast({ title: 'Deleted', description: 'Property deleted successfully' });
                      } catch (_err) {
                        toast({ title: 'Delete failed', description: 'Unable to delete property' });
                      }
                    }}
                    className="ml-2"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
