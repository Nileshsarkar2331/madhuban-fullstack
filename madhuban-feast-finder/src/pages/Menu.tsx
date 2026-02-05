import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { addToCart } from '@/lib/cart';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  priceLabel?: string;
  sizes?: { label: string; price: number }[];
  description?: string;
  isVeg?: boolean;
  tag?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>(
    {}
  );

  const getSelectedPrice = (item: MenuItem) => {
    if (!item.sizes || item.sizes.length === 0) return item.price;
    const selectedLabel = selectedSizes[item.id] || item.sizes[0].label;
    const found = item.sizes.find((s) => s.label === selectedLabel);
    return found?.price ?? item.sizes[0].price;
  };

  const handleAddToCart = (item: MenuItem) => {
    setLoadingId(item.id);
    const price = getSelectedPrice(item);
    const sizeLabel =
      item.sizes && item.sizes.length > 0
        ? selectedSizes[item.id] || item.sizes[0].label
        : undefined;
    const name = sizeLabel ? `${item.name} (${sizeLabel})` : item.name;
    addToCart(String(item.id), 1, { name, price });
    setTimeout(() => setLoadingId(null), 300);
  };

  const sections: MenuSection[] = [
    {
      title: 'Combo Momo Special',
      items: [
        {
          id: 1001,
          name: 'Combo Momo Special',
          price: 149,
          priceLabel: '₹149',
          description:
            'Kurkure Momo, Steam Momo, Tandoori Momo, Afghani Momo',
          tag: 'Combo',
        },
      ],
    },
    {
      title: 'Drinks',
      items: [
        { id: 1101, name: 'Kulhad Chai', price: 15, priceLabel: '₹15' },
        { id: 1102, name: 'Hot Coffee', price: 30, priceLabel: '₹30' },
        { id: 1103, name: 'Cold Coffee', price: 60, priceLabel: '₹60' },
        { id: 1104, name: 'KitKat Shake', price: 70, priceLabel: '₹70' },
        { id: 1105, name: 'Oreo Shake', price: 70, priceLabel: '₹70' },
        { id: 1106, name: 'Chocolate Shake', price: 70, priceLabel: '₹70' },
        { id: 1107, name: 'Mint Mojito', price: 70, priceLabel: '₹70' },
        { id: 1108, name: 'Blue Lagoon', price: 70, priceLabel: '₹70' },
        {
          id: 1109,
          name: 'Sweet & Salty Lemonade',
          price: 60,
          priceLabel: '₹60',
        },
      ],
    },
    {
      title: 'Continental - Pizza',
      items: [
        {
          id: 1201,
          name: 'Corn Pizza',
          price: 89,
          priceLabel: '₹89 / ₹149 / ₹189',
          sizes: [
            { label: 'Regular', price: 89 },
            { label: 'Medium', price: 149 },
            { label: 'Large', price: 189 },
          ],
        },
        {
          id: 1202,
          name: 'Farmhouse Pizza',
          price: 79,
          priceLabel: '₹79 / ₹109 / ₹159',
          sizes: [
            { label: 'Regular', price: 79 },
            { label: 'Medium', price: 109 },
            { label: 'Large', price: 159 },
          ],
        },
        {
          id: 1203,
          name: 'Paneer Pizza',
          price: 99,
          priceLabel: '₹99 / ₹149 / ₹199',
          sizes: [
            { label: 'Regular', price: 99 },
            { label: 'Medium', price: 149 },
            { label: 'Large', price: 199 },
          ],
        },
        {
          id: 1204,
          name: 'Onion Pizza',
          price: 79,
          priceLabel: '₹79 / ₹109 / ₹159',
          sizes: [
            { label: 'Regular', price: 79 },
            { label: 'Medium', price: 109 },
            { label: 'Large', price: 159 },
          ],
        },
      ],
    },
    {
      title: 'Continental - Burger',
      items: [
        {
          id: 1211,
          name: 'Aloo Tikki Burger',
          price: 34,
          priceLabel: '₹34',
        },
        {
          id: 1212,
          name: 'Crispy Chicken Burger',
          price: 59,
          priceLabel: '₹59',
        },
      ],
    },
    {
      title: 'Continental - Pasta',
      items: [
        {
          id: 1221,
          name: 'White Sauce Pasta',
          price: 120,
          priceLabel: '₹120',
        },
        {
          id: 1222,
          name: 'Red Sauce Pasta',
          price: 100,
          priceLabel: '₹100',
        },
      ],
    },
    {
      title: 'Combos',
      items: [
        {
          id: 1301,
          name: 'Pizza (Buy 1 Get 1 Free)',
          price: 199,
          priceLabel: '₹199',
          tag: 'BOGO',
        },
        {
          id: 1302,
          name: 'Burger (Buy 1 Get 1 Free)',
          price: 59,
          priceLabel: '₹59',
          tag: 'BOGO',
        },
        {
          id: 1303,
          name: 'Sunday Special: Mutton Momo',
          price: 149,
          priceLabel: '₹149',
          tag: 'Special',
        },
      ],
    },
    {
      title: 'Non-Veg Main Course',
      items: [
        {
          id: 1401,
          name: 'Special Kali Mirch Chicken',
          price: 220,
          priceLabel: '₹220 / ₹379',
          sizes: [
            { label: 'Half', price: 220 },
            { label: 'Full', price: 379 },
          ],
        },
        {
          id: 1402,
          name: 'Kadhi Chicken',
          price: 200,
          priceLabel: '₹200 / ₹349',
          sizes: [
            { label: 'Half', price: 200 },
            { label: 'Full', price: 349 },
          ],
        },
        {
          id: 1403,
          name: 'Chicken Curry',
          price: 209,
          priceLabel: '₹209 / ₹359',
          sizes: [
            { label: 'Half', price: 209 },
            { label: 'Full', price: 359 },
          ],
        },
        {
          id: 1404,
          name: 'Butter Chicken',
          price: 229,
          priceLabel: '₹229 / ₹389',
          sizes: [
            { label: 'Half', price: 229 },
            { label: 'Full', price: 389 },
          ],
        },
        {
          id: 1405,
          name: 'Tawa Chicken (Special)',
          price: 209,
          priceLabel: '₹209 / ₹399',
          tag: 'Special',
          sizes: [
            { label: 'Half', price: 209 },
            { label: 'Full', price: 399 },
          ],
        },
        {
          id: 1406,
          name: 'Chicken Changezi',
          price: 219,
          priceLabel: '₹219 / ₹379',
          sizes: [
            { label: 'Half', price: 219 },
            { label: 'Full', price: 379 },
          ],
        },
      ],
    },
    {
      title: 'Rice',
      items: [
        { id: 1501, name: 'Plain Rice', price: 70, priceLabel: '₹70' },
        { id: 1502, name: 'Jeera Rice', price: 80, priceLabel: '₹80' },
        { id: 1503, name: 'Tawa Pulao', price: 100, priceLabel: '₹100' },
      ],
    },
    {
      title: 'Roti / Bread',
      items: [
        { id: 1601, name: 'Tawa Roti', price: 10, priceLabel: '₹10' },
        { id: 1602, name: 'Butter Roti', price: 12, priceLabel: '₹12' },
        { id: 1603, name: 'Tandoori Roti', price: 15, priceLabel: '₹15' },
        { id: 1604, name: 'Plain Naan', price: 30, priceLabel: '₹30' },
        { id: 1605, name: 'Butter Naan', price: 35, priceLabel: '₹35' },
        { id: 1606, name: 'Garlic Naan', price: 40, priceLabel: '₹40' },
        { id: 1607, name: 'Lachha Paratha', price: 35, priceLabel: '₹35' },
        { id: 1608, name: 'Rumali Roti', price: 30, priceLabel: '₹30' },
        { id: 1609, name: 'Rumali Paratha', price: 40, priceLabel: '₹40' },
      ],
    },
    {
      title: 'Salad / Raita',
      items: [
        { id: 1701, name: 'Green Salad', price: 50, priceLabel: '₹50' },
        { id: 1702, name: 'Lachha Pyaz', price: 40, priceLabel: '₹40' },
        { id: 1703, name: 'Plain Raita Mix', price: 50, priceLabel: '₹50' },
        { id: 1704, name: 'Boondi Raita', price: 40, priceLabel: '₹40' },
        { id: 1705, name: 'Papad', price: 10, priceLabel: '₹10' },
      ],
    },
    {
      title: 'Chilli Items',
      items: [
        { id: 1801, name: 'Soyabean Chilli', price: 99, priceLabel: '₹99' },
        { id: 1802, name: 'Chilli Potato', price: 115, priceLabel: '₹115' },
        {
          id: 1803,
          name: 'Honey Chilli Potato',
          price: 149,
          priceLabel: '₹149',
        },
        { id: 1804, name: 'Chilli Chicken', price: 149, priceLabel: '₹149' },
        { id: 1805, name: 'Chilli Paneer', price: 169, priceLabel: '₹169' },
        { id: 1806, name: 'Chilli Mushroom', price: 119, priceLabel: '₹119' },
        {
          id: 1807,
          name: 'Chicken Lollipop (Dry/Gravy)',
          price: 149,
          priceLabel: '₹149 / ₹169',
        },
        { id: 1808, name: 'KFC Chicken Leg Piece', price: 89, priceLabel: '₹89' },
      ],
    },
    {
      title: 'Rolls',
      items: [
        {
          id: 1901,
          name: 'Kolkata Kathi Roll (Veg / Non-Veg)',
          price: 49,
          priceLabel: '₹49 / ₹69',
        },
        { id: 1902, name: 'Paneer Kathi Roll', price: 79, priceLabel: '₹79' },
        { id: 1903, name: 'Spring Roll', price: 69, priceLabel: '₹69' },
        {
          id: 1904,
          name: 'Egg Roll / Double Egg Roll',
          price: 59,
          priceLabel: '₹59 / ₹69',
        },
      ],
    },
    {
      title: 'Veg Main Course',
      items: [
        { id: 2001, name: 'Mix Veg', price: 149, priceLabel: '₹149' },
        { id: 2002, name: 'Dal Tadka', price: 99, priceLabel: '₹99' },
        { id: 2003, name: 'Dal Makhani', price: 189, priceLabel: '₹189' },
        {
          id: 2004,
          name: 'Paneer Butter Masala',
          price: 220,
          priceLabel: '₹220',
        },
        { id: 2005, name: 'Kadhi Paneer', price: 229, priceLabel: '₹229' },
        { id: 2006, name: 'Shahi Paneer', price: 229, priceLabel: '₹229' },
        { id: 2007, name: 'Matar Paneer', price: 229, priceLabel: '₹229' },
        { id: 2008, name: 'Paneer Do Pyaza', price: 229, priceLabel: '₹229' },
        { id: 2009, name: 'Palak Paneer', price: 219, priceLabel: '₹219' },
      ],
    },
    {
      title: 'Chinese',
      items: [
        { id: 2101, name: 'Veg Momo', price: 59, priceLabel: '₹59' },
        { id: 2102, name: 'Chicken Momo', price: 69, priceLabel: '₹69' },
        {
          id: 2103,
          name: 'Kurkure Momo',
          price: 99,
          priceLabel: '₹99 / ₹109',
          sizes: [
            { label: 'Veg', price: 99 },
            { label: 'Non-Veg', price: 109 },
          ],
        },
        {
          id: 2104,
          name: 'Tandoori Momo',
          price: 129,
          priceLabel: '₹129 / ₹139',
          sizes: [
            { label: 'Veg', price: 129 },
            { label: 'Non-Veg', price: 139 },
          ],
        },
        {
          id: 2105,
          name: 'Afghani Momo',
          price: 129,
          priceLabel: '₹129 / ₹139',
          sizes: [
            { label: 'Veg', price: 129 },
            { label: 'Non-Veg', price: 139 },
          ],
        },
        {
          id: 2106,
          name: 'Veg Noodles (Street Style)',
          price: 59,
          priceLabel: '₹59',
        },
        { id: 2107, name: 'Chicken Noodles', price: 79, priceLabel: '₹79' },
        { id: 2108, name: 'Schezwan Noodles', price: 89, priceLabel: '₹89' },
        { id: 2109, name: 'Hakka Noodles', price: 89, priceLabel: '₹89' },
        { id: 2110, name: 'Singapore Noodles', price: 109, priceLabel: '₹109' },
        { id: 2111, name: 'Chilli Garlic Noodles', price: 89, priceLabel: '₹89' },
        {
          id: 2112,
          name: 'Veg Manchurian',
          price: 99,
          priceLabel: '₹99 / ₹119',
          sizes: [
            { label: 'Dry', price: 99 },
            { label: 'Gravy', price: 119 },
          ],
        },
        { id: 2113, name: 'Veg Fried Rice', price: 69, priceLabel: '₹69' },
        { id: 2114, name: 'Chicken Fried Rice', price: 129, priceLabel: '₹129' },
        { id: 2115, name: 'Paneer Fried Rice', price: 139, priceLabel: '₹139' },
      ],
    },
    {
      title: 'Starters',
      items: [
        { id: 2201, name: 'Chicken Roasted', price: 129, priceLabel: '₹129' },
        { id: 2202, name: 'Peanut Masala', price: 79, priceLabel: '₹79' },
        { id: 2203, name: 'Chana Chaat', price: 79, priceLabel: '₹79' },
        { id: 2204, name: 'Veg Pakoda', price: 119, priceLabel: '₹119' },
        { id: 2205, name: 'Veg Paneer Mix', price: 149, priceLabel: '₹149' },
        { id: 2206, name: 'Paneer Pakoda', price: 149, priceLabel: '₹149' },
        { id: 2207, name: 'Egg Bhurji', price: 69, priceLabel: '₹69' },
        { id: 2208, name: 'Egg Omelette', price: 69, priceLabel: '₹69' },
        { id: 2209, name: 'Masala Fries', price: 89, priceLabel: '₹89' },
      ],
    },
    {
      title: 'Soup',
      items: [
        { id: 2301, name: 'Hot & Sour Soup', price: 49, priceLabel: '₹49' },
        { id: 2302, name: 'Manchow Soup', price: 49, priceLabel: '₹49' },
        { id: 2303, name: 'Lemon Coriander Soup', price: 49, priceLabel: '₹49' },
        { id: 2304, name: 'Chicken Soup', price: 59, priceLabel: '₹59' },
      ],
    },
  ];

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;

    return sections
      .map((section) => {
        const items = section.items.filter((item) =>
          `${item.name} ${item.description || ''} ${section.title}`
            .toLowerCase()
            .includes(q)
        );
        return { ...section, items };
      })
      .filter((section) => section.items.length > 0);
  }, [sections, searchQuery]);

  return (
    <div className="min-h-screen bg-background px-4 py-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Our Menu
      </h1>

      <div className="mb-8 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-10">
        {filteredSections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-primary">
                {section.title}
              </h2>
              <span className="text-sm text-muted-foreground">
                {section.items.length} items
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {section.items.map((item) => (
                <Card key={item.id} className="card-restaurant">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                        {item.tag && (
                          <Badge className="mt-2" variant="secondary">
                            {item.tag}
                          </Badge>
                        )}
                      </div>
                      {item.isVeg !== undefined && (
                        <div
                          className={`mt-1 h-4 w-4 rounded-full border-2 ${
                            item.isVeg
                              ? 'border-green-500 bg-green-100'
                              : 'border-red-500 bg-red-100'
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">
                          {item.sizes && item.sizes.length > 0
                            ? `₹${getSelectedPrice(item)}`
                            : item.priceLabel || `₹${item.price}`}
                        </span>
                        {item.sizes && item.sizes.length > 0 && (
                          <select
                            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                            value={
                              selectedSizes[item.id] || item.sizes[0].label
                            }
                            onChange={(e) =>
                              setSelectedSizes((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                          >
                            {item.sizes.map((size) => (
                              <option key={size.label} value={size.label}>
                                {size.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <Button
                        size="sm"
                        disabled={loadingId === item.id}
                        onClick={() => handleAddToCart(item)}
                      >
                        {loadingId === item.id ? 'Adding...' : 'Add to Cart'}
                        <Plus className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <p className="text-center text-muted-foreground">
            No items found. Try a different search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;
