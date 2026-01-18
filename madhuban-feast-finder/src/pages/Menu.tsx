import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Star, Clock, Flame, Filter } from 'lucide-react';

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Items', count: 120 },
    { id: 'veg-tandoori', name: 'Veg Tandoori Starter', count: 6 },
    { id: 'non-veg-tandoori', name: 'Non Veg Tandoori', count: 7 },
    { id: 'indian-paneer', name: 'Indian Paneer', count: 11 },
    { id: 'veg-main', name: 'Veg Main Course', count: 7 },
    { id: 'non-veg-main', name: 'Non Veg Main', count: 7 },
    { id: 'veg-chinese', name: 'Veg Chinese', count: 16 },
    { id: 'non-veg-chinese', name: 'Non Veg Chinese', count: 10 },
    { id: 'rice', name: 'Rice', count: 5 },
    { id: 'roti', name: 'Roti', count: 7 },
    { id: 'roll', name: 'Roll', count: 6 },
    { id: 'soup', name: 'Soup', count: 4 },
    { id: 'salad', name: 'Salad', count: 7 },
    { id: 'fry', name: 'Fry', count: 2 },
    { id: 'drinks', name: 'Drinks', count: 13 },
    { id: 'dessert', name: 'Dessert', count: 3 },
  ];

  const dishes = [
    // Veg Tandoori Starter
    { id: 1, name: 'Paneer Tikka Dry', description: 'Grilled cottage cheese marinated in spices', price: '180 (6pc)', category: 'veg-tandoori', rating: 4.7, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: true },
    { id: 2, name: 'Paneer Banjara Tikka Dry', description: 'Cottage cheese with special banjara spices', price: '190 (6pc)', category: 'veg-tandoori', rating: 4.6, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 3, name: 'Paneer Aachari Tikka Dry', description: 'Tangy pickle-flavored paneer tikka', price: '170 (6pc)', category: 'veg-tandoori', rating: 4.5, cookTime: '20 min', spiceLevel: 3, isVeg: true, popular: false },
    { id: 4, name: 'Paneer Malai Tikka', description: 'Creamy malai marinated cottage cheese', price: '170 (6pc)', category: 'veg-tandoori', rating: 4.8, cookTime: '20 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 5, name: 'Paneer Hill Top Dry', description: 'Special hill-style paneer preparation', price: '200 (2pc)', category: 'veg-tandoori', rating: 4.6, cookTime: '25 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 6, name: 'Paneer Pahadi Tikka Dry', description: 'Mountain-style spiced paneer tikka', price: '200 (6pc)', category: 'veg-tandoori', rating: 4.7, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: false },

    // Non Veg Tandoori Starter
    { id: 7, name: 'Chicken Tikka Dry', description: 'Juicy grilled chicken with aromatic spices', price: '180 (8pc)', category: 'non-veg-tandoori', rating: 4.8, cookTime: '25 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 8, name: 'Chicken Banjara Tikka Dry', description: 'Chicken with traditional banjara marinade', price: '180 (8pc)', category: 'non-veg-tandoori', rating: 4.7, cookTime: '25 min', spiceLevel: 2, isVeg: false, popular: false },
    { id: 9, name: 'Chicken Aachari Tikka Dry', description: 'Pickle-spiced chicken tikka', price: '160 (8pc)', category: 'non-veg-tandoori', rating: 4.6, cookTime: '25 min', spiceLevel: 3, isVeg: false, popular: false },
    { id: 10, name: 'Chicken Legpics Dry', description: 'Tender grilled chicken legs', price: '140 (2pc)', category: 'non-veg-tandoori', rating: 4.5, cookTime: '30 min', spiceLevel: 2, isVeg: false, popular: false },
    { id: 11, name: 'Chicken Malai Tikka', description: 'Creamy malai chicken tikka', price: '160 (8pc)', category: 'non-veg-tandoori', rating: 4.8, cookTime: '25 min', spiceLevel: 1, isVeg: false, popular: true },
    { id: 12, name: 'Chicken Half Full Tikka Dry', description: 'Half or full chicken tikka', price: '220/460', category: 'non-veg-tandoori', rating: 4.9, cookTime: '35 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 13, name: 'Chicken Hill Top Dry', description: 'Special hill-style chicken preparation', price: '180 (6pc)', category: 'non-veg-tandoori', rating: 4.7, cookTime: '25 min', spiceLevel: 2, isVeg: false, popular: false },

    // Indian Paneer
    { id: 14, name: 'Paneer Tikka Masala', description: 'Grilled paneer in rich tomato gravy', price: 200, category: 'indian-paneer', rating: 4.8, cookTime: '25 min', spiceLevel: 2, isVeg: true, popular: true },
    { id: 15, name: 'Paneer Butter Masala', description: 'Cottage cheese in creamy butter sauce', price: 220, category: 'indian-paneer', rating: 4.9, cookTime: '25 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 16, name: 'Kadai Paneer', description: 'Paneer cooked with bell peppers in kadai', price: 210, category: 'indian-paneer', rating: 4.7, cookTime: '25 min', spiceLevel: 2, isVeg: true, popular: true },
    { id: 17, name: 'Paneer Angara', description: 'Fiery spiced paneer preparation', price: 240, category: 'indian-paneer', rating: 4.6, cookTime: '25 min', spiceLevel: 3, isVeg: true, popular: false },
    { id: 18, name: 'Shahi Paneer', description: 'Royal cottage cheese in rich gravy', price: 230, category: 'indian-paneer', rating: 4.8, cookTime: '25 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 19, name: 'Paneer Bhurji', description: 'Scrambled cottage cheese with spices', price: 250, category: 'indian-paneer', rating: 4.7, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 20, name: 'Paneer Handi', description: 'Clay pot cooked paneer curry', price: 230, category: 'indian-paneer', rating: 4.7, cookTime: '30 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 21, name: 'Paneer Lajeij', description: 'Special lajeij style paneer curry', price: 260, category: 'indian-paneer', rating: 4.6, cookTime: '25 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 22, name: 'Masala Paneer Roll', description: 'Spiced paneer wrapped in roll', price: 200, category: 'indian-paneer', rating: 4.5, cookTime: '15 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 23, name: 'Palak Paneer', description: 'Cottage cheese in spinach gravy', price: 200, category: 'indian-paneer', rating: 4.8, cookTime: '25 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 24, name: 'Matar Paneer', description: 'Paneer and peas in tomato gravy', price: 200, category: 'indian-paneer', rating: 4.6, cookTime: '25 min', spiceLevel: 1, isVeg: true, popular: false },

    // Veg Main Course
    { id: 25, name: 'Veg Tufani', description: 'Spicy mixed vegetable tufani curry', price: 180, category: 'veg-main', rating: 4.6, cookTime: '25 min', spiceLevel: 3, isVeg: true, popular: false },
    { id: 26, name: 'Veg Kadhai', description: 'Mixed vegetables in kadai-style gravy', price: 170, category: 'veg-main', rating: 4.7, cookTime: '25 min', spiceLevel: 2, isVeg: true, popular: true },
    { id: 27, name: 'Veg Handi', description: 'Vegetables cooked in clay pot', price: 160, category: 'veg-main', rating: 4.6, cookTime: '30 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 28, name: 'Veg Jaipuri', description: 'Royal Rajasthani vegetable preparation', price: 160, category: 'veg-main', rating: 4.5, cookTime: '25 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 29, name: 'Makhani Daal', description: 'Creamy black lentils in butter', price: 160, category: 'veg-main', rating: 4.8, cookTime: '35 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 30, name: 'Daal Fry', description: 'Tempered yellow lentils', price: 80, category: 'veg-main', rating: 4.5, cookTime: '20 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 31, name: 'Daal Tadka', description: 'Lentils with spiced tempering', price: 100, category: 'veg-main', rating: 4.6, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: true },

    // Non Veg Main Course
    { id: 32, name: 'Chicken Tikka Masala', description: 'Grilled chicken in rich masala gravy', price: '200/360', category: 'non-veg-main', rating: 4.8, cookTime: '30 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 33, name: 'Chicken Battar Masala', description: 'Special butter chicken preparation', price: '220/400', category: 'non-veg-main', rating: 4.9, cookTime: '30 min', spiceLevel: 1, isVeg: false, popular: true },
    { id: 34, name: 'Chicken Rali Mirch', description: 'Chicken with black pepper and spices', price: '200/360', category: 'non-veg-main', rating: 4.6, cookTime: '30 min', spiceLevel: 3, isVeg: false, popular: false },
    { id: 35, name: 'Chicken Handi', description: 'Clay pot cooked chicken curry', price: '200/360', category: 'non-veg-main', rating: 4.7, cookTime: '35 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 36, name: 'Chicken Kari', description: 'Traditional chicken curry', price: '200/360', category: 'non-veg-main', rating: 4.6, cookTime: '30 min', spiceLevel: 2, isVeg: false, popular: false },
    { id: 37, name: 'Chicken Masala', description: 'Classic spiced chicken curry', price: '200/360', category: 'non-veg-main', rating: 4.7, cookTime: '30 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 38, name: 'Chicken Special', description: "Chef's special chicken preparation", price: 400, category: 'non-veg-main', rating: 4.9, cookTime: '35 min', spiceLevel: 2, isVeg: false, popular: true },

    // Veg Chinese
    { id: 39, name: 'Veg Momos', description: 'Steamed vegetable dumplings', price: 50, category: 'veg-chinese', rating: 4.7, cookTime: '15 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 40, name: 'Fry Veg Momos', description: 'Crispy fried vegetable momos', price: 60, category: 'veg-chinese', rating: 4.8, cookTime: '15 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 41, name: 'Manchurian Dry', description: 'Crispy vegetable manchurian balls', price: 100, category: 'veg-chinese', rating: 4.6, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: true },
    { id: 42, name: 'Manchurian Grevy', description: 'Vegetable manchurian in sauce', price: 100, category: 'veg-chinese', rating: 4.6, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 43, name: 'Paneer Chilli', description: 'Spicy paneer with bell peppers', price: 120, category: 'veg-chinese', rating: 4.8, cookTime: '20 min', spiceLevel: 3, isVeg: true, popular: true },
    { id: 44, name: 'Paneer Chilli Grevy', description: 'Paneer chilli in gravy sauce', price: 150, category: 'veg-chinese', rating: 4.7, cookTime: '20 min', spiceLevel: 3, isVeg: true, popular: false },
    { id: 45, name: 'Veg Fry Rice', description: 'Stir-fried rice with vegetables', price: 50, category: 'veg-chinese', rating: 4.5, cookTime: '15 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 46, name: 'Fry Rice Paneer', description: 'Fried rice with paneer chunks', price: 80, category: 'veg-chinese', rating: 4.6, cookTime: '15 min', spiceLevel: 1, isVeg: true, popular: false },
    { id: 47, name: 'Veg Hakka Noodles', description: 'Classic hakka-style noodles', price: 100, category: 'veg-chinese', rating: 4.7, cookTime: '15 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 48, name: 'Veg Noodles', description: 'Stir-fried vegetable noodles', price: 60, category: 'veg-chinese', rating: 4.5, cookTime: '15 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 49, name: 'Chines Bell', description: 'Special Chinese bell peppers dish', price: 120, category: 'veg-chinese', rating: 4.4, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 50, name: 'Manchurian Noodles', description: 'Noodles with manchurian balls', price: 100, category: 'veg-chinese', rating: 4.6, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 51, name: 'Honey Chilli Potato', description: 'Crispy potato in honey chilli sauce', price: 120, category: 'veg-chinese', rating: 4.8, cookTime: '20 min', spiceLevel: 2, isVeg: true, popular: true },
    { id: 52, name: 'Dragon Potato', description: 'Spicy dragon-style fried potato', price: 100, category: 'veg-chinese', rating: 4.5, cookTime: '20 min', spiceLevel: 3, isVeg: true, popular: false },
    { id: 53, name: 'Veg Spring Roll', description: 'Crispy vegetable spring rolls', price: 60, category: 'veg-chinese', rating: 4.6, cookTime: '15 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 54, name: 'Siga Roll', description: 'Special siga-style vegetable roll', price: 80, category: 'veg-chinese', rating: 4.4, cookTime: '15 min', spiceLevel: 1, isVeg: true, popular: false },

    // Non Veg Chinese
    { id: 55, name: 'Non Veg Momos', description: 'Steamed chicken dumplings', price: 60, category: 'non-veg-chinese', rating: 4.8, cookTime: '15 min', spiceLevel: 1, isVeg: false, popular: true },
    { id: 56, name: 'Kurkure Non Veg Momos', description: 'Crispy fried chicken momos', price: 80, category: 'non-veg-chinese', rating: 4.9, cookTime: '15 min', spiceLevel: 1, isVeg: false, popular: true },
    { id: 57, name: 'Chicken Rice', description: 'Fried rice with chicken', price: 60, category: 'non-veg-chinese', rating: 4.6, cookTime: '15 min', spiceLevel: 1, isVeg: false, popular: true },
    { id: 58, name: 'Egg Rice', description: 'Fried rice with scrambled eggs', price: 50, category: 'non-veg-chinese', rating: 4.5, cookTime: '15 min', spiceLevel: 1, isVeg: false, popular: false },
    { id: 59, name: 'Egg Noodles', description: 'Stir-fried noodles with eggs', price: 50, category: 'non-veg-chinese', rating: 4.5, cookTime: '15 min', spiceLevel: 1, isVeg: false, popular: false },
    { id: 60, name: 'Chilli Chicken Dry', description: 'Crispy chicken in chilli sauce', price: 150, category: 'non-veg-chinese', rating: 4.8, cookTime: '20 min', spiceLevel: 3, isVeg: false, popular: true },
    { id: 61, name: 'Chilli Chicken Grevy', description: 'Chicken chilli in gravy sauce', price: 170, category: 'non-veg-chinese', rating: 4.7, cookTime: '20 min', spiceLevel: 3, isVeg: false, popular: false },
    { id: 62, name: 'Chicken Lolilpop', description: 'Fried chicken lollipop wings', price: 150, category: 'non-veg-chinese', rating: 4.9, cookTime: '20 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 63, name: 'Chicken Noodles', description: 'Noodles with chicken chunks', price: 80, category: 'non-veg-chinese', rating: 4.6, cookTime: '15 min', spiceLevel: 1, isVeg: false, popular: true },
    { id: 64, name: 'Chicken Leg Piece', description: 'Fried chicken leg piece', price: '70/pc', category: 'non-veg-chinese', rating: 4.7, cookTime: '20 min', spiceLevel: 1, isVeg: false, popular: false },

    // Rice
    { id: 65, name: 'Jeera Rice', description: 'Aromatic cumin-flavored rice', price: 70, category: 'rice', rating: 4.6, cookTime: '15 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 66, name: 'Steem Rice', description: 'Plain steamed basmati rice', price: 60, category: 'rice', rating: 4.4, cookTime: '15 min', spiceLevel: 0, isVeg: true, popular: false },
    { id: 67, name: 'Chicken Biryani', description: 'Fragrant basmati rice with chicken', price: 80, category: 'rice', rating: 4.9, cookTime: '30 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 68, name: 'Veg Biryani', description: 'Mixed vegetable biryani', price: 60, category: 'rice', rating: 4.7, cookTime: '25 min', spiceLevel: 2, isVeg: true, popular: true },
    { id: 69, name: 'Veg Pulao', description: 'Mildly spiced vegetable rice', price: 50, category: 'rice', rating: 4.5, cookTime: '20 min', spiceLevel: 1, isVeg: true, popular: false },

    // Roti
    { id: 70, name: 'Rumali Roti', description: 'Thin handkerchief-style roti', price: 35, category: 'roti', rating: 4.6, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: false },
    { id: 71, name: 'Tawa Roti', description: 'Traditional griddle-cooked roti', price: 10, category: 'roti', rating: 4.5, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 72, name: 'Tandoori Roti', description: 'Clay oven baked roti', price: 15, category: 'roti', rating: 4.6, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 73, name: 'Butter Tandoori Roti', description: 'Buttered tandoori roti', price: 20, category: 'roti', rating: 4.7, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 74, name: 'Plain Naan', description: 'Soft leavened tandoori bread', price: 40, category: 'roti', rating: 4.7, cookTime: '10 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 75, name: 'Butter Naan', description: 'Buttered soft naan bread', price: 45, category: 'roti', rating: 4.8, cookTime: '10 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 76, name: 'Butter Lacha Partha', description: 'Layered butter paratha', price: 50, category: 'roti', rating: 4.8, cookTime: '10 min', spiceLevel: 0, isVeg: true, popular: true },

    // Roll
    { id: 77, name: 'Chicken Roll', description: 'Spiced chicken wrapped in paratha', price: 100, category: 'roll', rating: 4.7, cookTime: '15 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 78, name: 'Chicken Egg Roll', description: 'Chicken and egg wrapped roll', price: 120, category: 'roll', rating: 4.8, cookTime: '15 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 79, name: 'Pancer Masala Roll', description: 'Spiced paneer in paratha roll', price: 80, category: 'roll', rating: 4.6, cookTime: '15 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 80, name: 'Egg Roll', description: 'Scrambled egg wrapped in paratha', price: 60, category: 'roll', rating: 4.5, cookTime: '10 min', spiceLevel: 1, isVeg: false, popular: true },
    { id: 81, name: 'Omelette', description: 'Classic Indian-style omelette', price: 50, category: 'roll', rating: 4.4, cookTime: '10 min', spiceLevel: 1, isVeg: false, popular: false },
    { id: 82, name: 'Egg Bhurji', description: 'Spiced scrambled eggs', price: 60, category: 'roll', rating: 4.6, cookTime: '10 min', spiceLevel: 2, isVeg: false, popular: true },

    // Soup
    { id: 83, name: 'Monchwo Soup', description: 'Traditional manchow soup', price: 40, category: 'soup', rating: 4.5, cookTime: '15 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 84, name: 'Hot And Sawar Soup', description: 'Tangy hot and sour soup', price: 40, category: 'soup', rating: 4.6, cookTime: '15 min', spiceLevel: 2, isVeg: true, popular: true },
    { id: 85, name: 'Lemon Corrinder Soup', description: 'Refreshing lemon coriander soup', price: 50, category: 'soup', rating: 4.7, cookTime: '15 min', spiceLevel: 1, isVeg: true, popular: true },
    { id: 86, name: 'Tomato Soup', description: 'Classic creamy tomato soup', price: 40, category: 'soup', rating: 4.5, cookTime: '15 min', spiceLevel: 0, isVeg: true, popular: false },

    // Salad
    { id: 87, name: 'Green Salad', description: 'Fresh mixed green salad', price: 50, category: 'salad', rating: 4.4, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 88, name: 'Sirka Onion Salad', description: 'Vinegar-marinated onion salad', price: 30, category: 'salad', rating: 4.3, cookTime: '5 min', spiceLevel: 1, isVeg: true, popular: false },
    { id: 89, name: 'Boondi Raita', description: 'Yogurt with crispy boondi', price: 40, category: 'salad', rating: 4.5, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 90, name: 'Veg Raita', description: 'Yogurt with mixed vegetables', price: 50, category: 'salad', rating: 4.6, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 91, name: 'Masala Papad', description: 'Crispy papad with spiced toppings', price: 20, category: 'salad', rating: 4.4, cookTime: '5 min', spiceLevel: 2, isVeg: true, popular: false },
    { id: 92, name: 'Fry Papad', description: 'Fried crispy papad', price: 10, category: 'salad', rating: 4.2, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: false },
    { id: 93, name: 'Rosted Papad', description: 'Roasted crispy papad', price: 15, category: 'salad', rating: 4.3, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: false },

    // Fry
    { id: 94, name: 'Chicken Rosted', description: 'Roasted chicken pieces', price: '150 (12pc)', category: 'fry', rating: 4.8, cookTime: '25 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 95, name: 'Fish Fry', description: 'Crispy fried fish pieces', price: '120 (4pc)', category: 'fry', rating: 4.7, cookTime: '20 min', spiceLevel: 2, isVeg: false, popular: true },

    // Drinks
    { id: 96, name: 'Kulhad Chai', description: 'Traditional clay pot tea', price: 15, category: 'drinks', rating: 4.8, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 97, name: 'Hot Coffee', description: 'Freshly brewed hot coffee', price: 30, category: 'drinks', rating: 4.5, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: false },
    { id: 98, name: 'Cold Coffee', description: 'Chilled blended coffee', price: 60, category: 'drinks', rating: 4.7, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 99, name: 'Chocolate Milk Shake', description: 'Rich chocolate shake', price: 80, category: 'drinks', rating: 4.8, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 100, name: 'Oreo Milk Shake', description: 'Creamy oreo cookie shake', price: 80, category: 'drinks', rating: 4.8, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 101, name: 'Banana Shake', description: 'Fresh banana milkshake', price: 50, category: 'drinks', rating: 4.6, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: false },
    { id: 102, name: 'Mango Shake', description: 'Seasonal mango shake', price: 60, category: 'drinks', rating: 4.7, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 103, name: 'Blue Lagoon', description: 'Refreshing blue lagoon mocktail', price: 70, category: 'drinks', rating: 4.6, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: false },
    { id: 104, name: 'Mint Mojito', description: 'Fresh mint mojito', price: 80, category: 'drinks', rating: 4.8, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 105, name: 'Lemon Water', description: 'Fresh lemon water', price: 20, category: 'drinks', rating: 4.4, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: false },
    { id: 106, name: 'Sweet Lassi', description: 'Sweet yogurt drink', price: 45, category: 'drinks', rating: 4.7, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 107, name: 'Butter Milk', description: 'Traditional buttermilk', price: 20, category: 'drinks', rating: 4.5, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: false },
    { id: 108, name: 'Masala Butter Milk', description: 'Spiced buttermilk', price: 25, category: 'drinks', rating: 4.6, cookTime: '5 min', spiceLevel: 1, isVeg: true, popular: false },

    // Dessert
    { id: 109, name: 'Ice Cream', description: 'Assorted ice cream flavors', price: 'Ask', category: 'dessert', rating: 4.6, cookTime: '2 min', spiceLevel: 0, isVeg: true, popular: false },
    { id: 110, name: 'Gulab Jamun', description: 'Sweet milk dumplings in syrup', price: '25/pc', category: 'dessert', rating: 4.9, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
    { id: 111, name: 'Rusgulle', description: 'Spongy cottage cheese balls in syrup', price: '35/pc', category: 'dessert', rating: 4.7, cookTime: '5 min', spiceLevel: 0, isVeg: true, popular: true },
  ];

  const getSpiceIcons = (level: number) => {
    return Array(3).fill(0).map((_, i) => (
      <Flame
        key={i}
        className={`h-3 w-3 ${i < level ? 'text-red-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterByCategory = (category: string) => {
    if (category === 'all') return filteredDishes;
    return filteredDishes.filter(dish => dish.category === category);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Our Menu</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of authentic Indian dishes, made with love and traditional recipes
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="all" className="w-full">
          {/* Category Tabs */}
          <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent mb-8 p-0">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id} 
                className="text-sm bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2 transition-all"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs bg-background/50">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dishes Content */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterByCategory(category.id).map((dish) => (
                  <Card key={dish.id} className="card-restaurant group">
                    <CardContent className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg text-primary">
                              {dish.name}
                            </h3>
                            {dish.popular && (
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {dish.description}
                          </p>
                        </div>

                        {/* Veg/Non-veg indicator */}
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          dish.isVeg ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mx-auto mt-0.5 ${
                            dish.isVeg ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{dish.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{dish.cookTime}</span>
                        </div>
                        {dish.spiceLevel > 0 && (
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-0.5">
                              {getSpiceIcons(dish.spiceLevel)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price and Add Button */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xl font-bold text-primary">
                          ₹{typeof dish.price === 'string' ? dish.price : dish.price}
                        </span>
                        <Button variant="secondary" size="sm" className="group/btn">
                          Add to Cart
                          <Plus className="h-4 w-4 ml-1 transition-transform group-hover/btn:scale-110" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filterByCategory(category.id).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No dishes found matching your search.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Copyright Footer */}
      <div className="bg-muted/30 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All Rights Reserved to <span className="font-bold text-primary">Madhuवन</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;