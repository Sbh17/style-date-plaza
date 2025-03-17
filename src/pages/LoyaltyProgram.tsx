
import React, { useState } from 'react';
import { 
  Award, Gift, BadgePercent, CreditCard, Users, Star, 
  ChevronUp, ChevronDown, Plus, Edit, Trash, Settings
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Mock data for loyalty program
const MOCK_LOYALTY_TIERS = [
  {
    id: "t1",
    name: "Bronze",
    points: 0,
    benefits: [
      "5% off selected services",
      "Birthday gift",
      "Access to exclusive events"
    ],
    color: "bg-amber-700"
  },
  {
    id: "t2",
    name: "Silver",
    points: 500,
    benefits: [
      "10% off all services",
      "Complimentary refreshments",
      "Priority booking",
      "Quarterly gift"
    ],
    color: "bg-slate-400"
  },
  {
    id: "t3",
    name: "Gold",
    points: 1000,
    benefits: [
      "15% off all services",
      "Free monthly treatment",
      "VIP booking privileges",
      "Dedicated stylist",
      "Annual luxury gift"
    ],
    color: "bg-amber-500"
  },
  {
    id: "t4",
    name: "Platinum",
    points: 2000,
    benefits: [
      "20% off all services",
      "Complimentary monthly service",
      "After-hours appointments",
      "Personal beauty consultant",
      "Exclusive seasonal gift boxes"
    ],
    color: "bg-zinc-700"
  }
];

const MOCK_REWARDS = [
  {
    id: "r1",
    name: "Free Blowout",
    points: 250,
    description: "Redeem for a complimentary blowout service with any stylist",
    availability: "Always Available",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    redeemed: 24
  },
  {
    id: "r2",
    name: "Deluxe Manicure",
    points: 300,
    description: "Enjoy a premium manicure with nail art of your choice",
    availability: "Always Available",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    redeemed: 18
  },
  {
    id: "r3",
    name: "Luxury Hair Care Bundle",
    points: 500,
    description: "A collection of premium hair care products selected by our stylists",
    availability: "Limited Availability",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    redeemed: 12
  },
  {
    id: "r4",
    name: "Spa Day Package",
    points: 1000,
    description: "Full day spa experience including facial, massage, and lunch",
    availability: "Limited Availability",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    redeemed: 5
  }
];

const MOCK_CUSTOMERS = [
  {
    id: "c1",
    name: "Emma Thompson",
    email: "emma@example.com",
    avatar: "https://i.pravatar.cc/150?u=emma",
    tier: "Gold",
    points: 1250,
    joinDate: "2023-01-15",
    totalSpent: "$1,850",
    recentActivity: [
      { date: "2023-10-10", action: "Earned 50 points", service: "Haircut & Style" },
      { date: "2023-09-25", action: "Redeemed 300 points", reward: "Deluxe Manicure" },
      { date: "2023-09-05", action: "Earned 75 points", service: "Color & Style" }
    ]
  },
  {
    id: "c2",
    name: "James Wilson",
    email: "james@example.com",
    avatar: "https://i.pravatar.cc/150?u=james",
    tier: "Silver",
    points: 650,
    joinDate: "2023-03-22",
    totalSpent: "$920",
    recentActivity: [
      { date: "2023-10-05", action: "Earned 45 points", service: "Men's Haircut" },
      { date: "2023-09-20", action: "Earned 30 points", service: "Beard Trim" }
    ]
  },
  {
    id: "c3",
    name: "Olivia Martinez",
    email: "olivia@example.com",
    avatar: "https://i.pravatar.cc/150?u=olivia",
    tier: "Platinum",
    points: 2350,
    joinDate: "2022-11-08",
    totalSpent: "$3,200",
    recentActivity: [
      { date: "2023-10-12", action: "Redeemed 1000 points", reward: "Spa Day Package" },
      { date: "2023-10-01", action: "Earned 120 points", service: "Full Highlights" },
      { date: "2023-09-15", action: "Earned 80 points", service: "Facial & Massage" }
    ]
  },
  {
    id: "c4",
    name: "Daniel Lee",
    email: "daniel@example.com",
    avatar: "https://i.pravatar.cc/150?u=daniel",
    tier: "Bronze",
    points: 320,
    joinDate: "2023-05-30",
    totalSpent: "$450",
    recentActivity: [
      { date: "2023-10-08", action: "Earned 35 points", service: "Men's Haircut" },
      { date: "2023-09-22", action: "Earned 25 points", service: "Beard Trim" }
    ]
  }
];

const LoyaltyProgram: React.FC = () => {
  const [loyaltyTiers, setLoyaltyTiers] = useState(MOCK_LOYALTY_TIERS);
  const [rewards, setRewards] = useState(MOCK_REWARDS);
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [isAddingTier, setIsAddingTier] = useState(false);
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [newTier, setNewTier] = useState({
    name: '',
    points: '',
    benefits: [''],
    color: 'bg-primary'
  });
  const [newReward, setNewReward] = useState({
    name: '',
    points: '',
    description: '',
    availability: 'Always Available',
    image: ''
  });
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [programEnabled, setProgramEnabled] = useState(true);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [expandedTier, setExpandedTier] = useState<string | null>("t1");

  const handleAddTier = () => {
    if (!newTier.name || !newTier.points) {
      toast.error('Please enter the tier name and points threshold');
      return;
    }
    
    const tierToAdd = {
      id: `t${loyaltyTiers.length + 1}`,
      name: newTier.name,
      points: parseInt(newTier.points),
      benefits: newTier.benefits.filter(benefit => benefit.trim() !== ''),
      color: newTier.color
    };
    
    setLoyaltyTiers([...loyaltyTiers, tierToAdd]);
    setNewTier({ name: '', points: '', benefits: [''], color: 'bg-primary' });
    setIsAddingTier(false);
    toast.success('Loyalty tier added successfully!');
  };

  const handleAddBenefitField = () => {
    setNewTier({
      ...newTier,
      benefits: [...newTier.benefits, '']
    });
  };

  const handleRemoveBenefitField = (index: number) => {
    const updatedBenefits = [...newTier.benefits];
    updatedBenefits.splice(index, 1);
    setNewTier({
      ...newTier,
      benefits: updatedBenefits
    });
  };

  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...newTier.benefits];
    updatedBenefits[index] = value;
    setNewTier({
      ...newTier,
      benefits: updatedBenefits
    });
  };

  const handleAddReward = () => {
    if (!newReward.name || !newReward.points || !newReward.description) {
      toast.error('Please enter reward name, points, and description');
      return;
    }
    
    const rewardToAdd = {
      id: `r${rewards.length + 1}`,
      name: newReward.name,
      points: parseInt(newReward.points),
      description: newReward.description,
      availability: newReward.availability,
      image: newReward.image || "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1450&q=80",
      redeemed: 0
    };
    
    setRewards([...rewards, rewardToAdd]);
    setNewReward({
      name: '',
      points: '',
      description: '',
      availability: 'Always Available',
      image: ''
    });
    setIsAddingReward(false);
    toast.success('Reward added successfully!');
  };
  
  const handleDeleteTier = (tierId: string) => {
    const updatedTiers = loyaltyTiers.filter(tier => tier.id !== tierId);
    setLoyaltyTiers(updatedTiers);
    toast.success('Tier removed successfully!');
  };
  
  const handleDeleteReward = (rewardId: string) => {
    const updatedRewards = rewards.filter(reward => reward.id !== rewardId);
    setRewards(updatedRewards);
    toast.success('Reward removed successfully!');
  };

  const getTierColor = (tierName: string) => {
    const tier = loyaltyTiers.find(t => t.name === tierName);
    return tier ? tier.color : 'bg-gray-300';
  };

  const getTierProgress = (points: number) => {
    // Sort tiers by points requirement
    const sortedTiers = [...loyaltyTiers].sort((a, b) => a.points - b.points);
    
    // Find the current tier and next tier
    let currentTierIndex = 0;
    let nextTierPoints = 0;
    
    for (let i = 0; i < sortedTiers.length; i++) {
      if (points >= sortedTiers[i].points) {
        currentTierIndex = i;
      } else {
        nextTierPoints = sortedTiers[i].points;
        break;
      }
    }
    
    // If customer is at the highest tier
    if (currentTierIndex === sortedTiers.length - 1) {
      return 100;
    }
    
    const currentTierPoints = sortedTiers[currentTierIndex].points;
    const pointsToNextTier = nextTierPoints - currentTierPoints;
    const pointsEarnedInCurrentTier = points - currentTierPoints;
    
    return Math.round((pointsEarnedInCurrentTier / pointsToNextTier) * 100);
  };

  const getNextTier = (tierName: string) => {
    const sortedTiers = [...loyaltyTiers].sort((a, b) => a.points - b.points);
    const currentTierIndex = sortedTiers.findIndex(tier => tier.name === tierName);
    
    if (currentTierIndex === sortedTiers.length - 1) {
      return null; // Already at highest tier
    }
    
    return sortedTiers[currentTierIndex + 1];
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              Loyalty Program
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your salon's loyalty program, tiers, and rewards
            </p>
          </div>
          <Button 
            variant={programEnabled ? "destructive" : "default"}
            onClick={() => {
              setProgramEnabled(!programEnabled);
              toast.success(`Loyalty program ${programEnabled ? 'paused' : 'activated'}`);
            }}
          >
            {programEnabled ? 'Pause Program' : 'Activate Program'}
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 since last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Points Issued
                  </CardTitle>
                  <BadgePercent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,280</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rewards Redeemed
                  </CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">59</div>
                  <p className="text-xs text-muted-foreground">
                    +7 since last month
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Program Status</CardTitle>
                    <CardDescription>Configure your loyalty program settings</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Loyalty Program Settings</DialogTitle>
                        <DialogDescription>
                          Configure how your loyalty program works
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="program-active" className="font-medium">Program Active</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable or disable the entire loyalty program
                            </p>
                          </div>
                          <Switch
                            id="program-active"
                            checked={programEnabled}
                            onCheckedChange={setProgramEnabled}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="earning-rate">Earning Rate ($ per point)</Label>
                          <div className="flex gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm">
                              $
                            </span>
                            <Input id="earning-rate" placeholder="10" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Amount customers need to spend to earn 1 point
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiration">Points Expiration (days)</Label>
                          <Input id="expiration" placeholder="365" />
                          <p className="text-xs text-muted-foreground">
                            Days until earned points expire, or leave blank for no expiration
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="birthday-bonus" className="font-medium">Birthday Bonus</Label>
                            <p className="text-sm text-muted-foreground">
                              Give bonus points on customer birthdays
                            </p>
                          </div>
                          <Switch
                            id="birthday-bonus"
                            defaultChecked={true}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="referral-bonus" className="font-medium">Referral Bonus</Label>
                            <p className="text-sm text-muted-foreground">
                              Give points for customer referrals
                            </p>
                          </div>
                          <Switch
                            id="referral-bonus"
                            defaultChecked={true}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>Save Settings</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Program Status</span>
                      <Badge className={programEnabled ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}>
                        {programEnabled ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Points Earning Rate</span>
                      <span className="text-sm">$10 = 1 point</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Points Expiration</span>
                      <span className="text-sm">365 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Birthday Bonus</span>
                      <span className="text-sm">50 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Referral Bonus</span>
                      <span className="text-sm">100 points</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">Tier Distribution</h3>
                    <div className="space-y-3">
                      {loyaltyTiers.map(tier => {
                        const memberCount = customers.filter(c => c.tier === tier.name).length;
                        const percentage = (memberCount / customers.length) * 100;
                        
                        return (
                          <div key={tier.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{tier.name}</span>
                              <span>{memberCount} members ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${tier.color} rounded-full`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tiers" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Loyalty Tiers</h2>
              <Dialog open={isAddingTier} onOpenChange={setIsAddingTier}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Tier
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Loyalty Tier</DialogTitle>
                    <DialogDescription>
                      Create a new tier level for your loyalty program
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tierName">Tier Name</Label>
                        <Input 
                          id="tierName" 
                          value={newTier.name} 
                          onChange={e => setNewTier({...newTier, name: e.target.value})}
                          placeholder="e.g. Diamond" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tierPoints">Points Threshold</Label>
                        <Input 
                          id="tierPoints" 
                          type="number" 
                          value={newTier.points} 
                          onChange={e => setNewTier({...newTier, points: e.target.value})}
                          placeholder="e.g. 3000" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Benefits</Label>
                      {newTier.benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            value={benefit} 
                            onChange={e => handleBenefitChange(index, e.target.value)}
                            placeholder="e.g. 25% off all services" 
                          />
                          {index > 0 && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleRemoveBenefitField(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAddBenefitField}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Benefit
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tierColor">Color</Label>
                      <div className="flex gap-2">
                        {['bg-slate-500', 'bg-zinc-700', 'bg-amber-700', 'bg-amber-500', 'bg-emerald-500', 'bg-primary'].map(color => (
                          <div 
                            key={color}
                            className={`h-8 w-8 rounded-full ${color} cursor-pointer hover:ring-2 hover:ring-offset-2 ${
                              newTier.color === color ? 'ring-2 ring-offset-2' : ''
                            }`}
                            onClick={() => setNewTier({...newTier, color})}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingTier(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTier}>
                      Add Tier
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-4">
              {loyaltyTiers.map((tier) => (
                <Card key={tier.id}>
                  <CardHeader className="relative pb-2">
                    <div className={`absolute top-0 left-0 right-0 h-2 ${tier.color} rounded-t-lg`}></div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${tier.color} text-white`}>
                          {tier.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle>{tier.name}</CardTitle>
                          <CardDescription>{tier.points} points to qualify</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setExpandedTier(expandedTier === tier.id ? null : tier.id)}
                        >
                          {expandedTier === tier.id ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteTier(tier.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedTier === tier.id && (
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Benefits</h3>
                          <ul className="space-y-1">
                            {tier.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <Star className="h-3.5 w-3.5 mr-2 text-amber-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Member Statistics</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Total Members:</span>
                              <span className="font-medium ml-2">
                                {customers.filter(c => c.tier === tier.name).length}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Avg. Spending:</span>
                              <span className="font-medium ml-2">$950</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rewards" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Available Rewards</h2>
              <Dialog open={isAddingReward} onOpenChange={setIsAddingReward}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Reward
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Reward</DialogTitle>
                    <DialogDescription>
                      Create a new reward that customers can redeem with their points
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="rewardName">Reward Name</Label>
                      <Input 
                        id="rewardName" 
                        value={newReward.name} 
                        onChange={e => setNewReward({...newReward, name: e.target.value})}
                        placeholder="e.g. Free Haircut" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rewardPoints">Points Required</Label>
                      <Input 
                        id="rewardPoints" 
                        type="number"
                        value={newReward.points} 
                        onChange={e => setNewReward({...newReward, points: e.target.value})}
                        placeholder="e.g. 500" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rewardDescription">Description</Label>
                      <Textarea 
                        id="rewardDescription" 
                        value={newReward.description} 
                        onChange={e => setNewReward({...newReward, description: e.target.value})}
                        placeholder="Describe the reward details" 
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rewardImage">Image URL (optional)</Label>
                      <Input 
                        id="rewardImage" 
                        value={newReward.image} 
                        onChange={e => setNewReward({...newReward, image: e.target.value})}
                        placeholder="https://example.com/image.jpg" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rewardAvailability">Availability</Label>
                      <select
                        id="rewardAvailability"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newReward.availability}
                        onChange={e => setNewReward({...newReward, availability: e.target.value})}
                      >
                        <option value="Always Available">Always Available</option>
                        <option value="Limited Availability">Limited Availability</option>
                        <option value="Seasonal">Seasonal</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingReward(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddReward}>
                      Add Reward
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className="flex flex-col h-full">
                  <div className="relative h-40">
                    <img 
                      src={reward.image} 
                      alt={reward.name} 
                      className="absolute inset-0 h-full w-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-primary text-white text-sm font-medium px-2 py-1 rounded-md inline-block mb-1">
                          {reward.points} points
                        </div>
                        <h3 className="text-white text-lg font-semibold">{reward.name}</h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4 flex-grow">
                    <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Availability:</span>
                      <span className="font-medium">{reward.availability}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Times Redeemed:</span>
                      <span className="font-medium">{reward.redeemed}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex justify-between items-center w-full">
                      <Badge variant="outline">
                        {reward.availability === 'Always Available' ? 'Ongoing' : reward.availability}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteReward(reward.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program Members</CardTitle>
                <CardDescription>
                  View and manage your loyalty program members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={customer.avatar} alt={customer.name} />
                              <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{customer.name}</p>
                              <p className="text-xs text-muted-foreground">{customer.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getTierColor(customer.tier)} text-white hover:${getTierColor(customer.tier)}`}>
                            {customer.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{customer.points}</span>
                              {getNextTier(customer.tier) && (
                                <span className="text-xs text-muted-foreground">
                                  {getNextTier(customer.tier)?.points - customer.points} to {getNextTier(customer.tier)?.name}
                                </span>
                              )}
                            </div>
                            {getNextTier(customer.tier) && (
                              <Progress value={getTierProgress(customer.points)} className="h-1" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(customer.joinDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{customer.totalSpent}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowCustomerDetails(true);
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
              <DialogContent className="sm:max-w-[600px]">
                {selectedCustomer && (
                  <>
                    <DialogHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                          <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <DialogTitle>{selectedCustomer.name}</DialogTitle>
                          <DialogDescription className="flex items-center gap-2 mt-1">
                            Member since {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                            <Badge className={`${getTierColor(selectedCustomer.tier)} text-white`}>
                              {selectedCustomer.tier}
                            </Badge>
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 px-1">
                        <div>
                          <p className="text-sm text-muted-foreground">Points Balance</p>
                          <p className="text-2xl font-bold">{selectedCustomer.points}</p>
                          {getNextTier(selectedCustomer.tier) && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {getNextTier(selectedCustomer.tier)?.points - selectedCustomer.points} points to {getNextTier(selectedCustomer.tier)?.name}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                          <p className="text-2xl font-bold">{selectedCustomer.totalSpent}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                        <div className="space-y-3">
                          {selectedCustomer.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className="relative mt-1">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                {index !== selectedCustomer.recentActivity.length - 1 && (
                                  <div className="absolute top-2 bottom-0 left-1 w-[1px] bg-muted"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <p className="font-medium">{activity.action}</p>
                                  <p className="text-muted-foreground">{activity.date}</p>
                                </div>
                                {activity.service && (
                                  <p className="text-muted-foreground">Service: {activity.service}</p>
                                )}
                                {activity.reward && (
                                  <p className="text-muted-foreground">Reward: {activity.reward}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-3">Manage Points</h4>
                        <div className="flex gap-2">
                          <Input placeholder="Enter points amount" className="max-w-[150px]" />
                          <Button variant="outline" size="sm">Add Points</Button>
                          <Button variant="outline" size="sm">Deduct Points</Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LoyaltyProgram;
