
import React, { useState, useEffect } from 'react';
import { 
  Percent, Calendar, CalendarDays, Edit, Trash, PlusCircle, Clock, Gift
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data for promotions
const MOCK_PROMOTIONS = [
  {
    id: "p1",
    name: "Summer Sale",
    type: "discount",
    value: "25%",
    description: "25% off on all hair services for the summer season",
    validFrom: "2023-06-01",
    validTo: "2023-08-31",
    services: ["Haircut & Style", "Color & Style", "Blowout"],
    status: "active",
    redemptions: 43
  },
  {
    id: "p2",
    name: "New Customer Special",
    type: "discount",
    value: "15%",
    description: "Special discount for first-time customers",
    validFrom: "2023-01-01",
    validTo: "2023-12-31",
    services: ["All Services"],
    status: "active",
    redemptions: 68
  },
  {
    id: "p3",
    name: "Manicure & Pedicure Combo",
    type: "package",
    value: "$75",
    description: "Special price for a manicure and pedicure combo",
    validFrom: "2023-05-01",
    validTo: "2023-09-30",
    services: ["Manicure", "Pedicure"],
    status: "active",
    redemptions: 27
  },
  {
    id: "p4",
    name: "Holiday Special",
    type: "discount",
    value: "20%",
    description: "Festive season discount on all beauty services",
    validFrom: "2023-12-01",
    validTo: "2023-12-31",
    services: ["All Services"],
    status: "scheduled",
    redemptions: 0
  },
  {
    id: "p5",
    name: "Spring Facial",
    type: "package",
    value: "$55",
    description: "Refreshing facial package for spring",
    validFrom: "2023-03-01",
    validTo: "2023-05-31",
    services: ["Facial"],
    status: "expired",
    redemptions: 35
  }
];

// Mock data for gift cards
const MOCK_GIFT_CARDS = [
  {
    id: "gc1",
    code: "BEAUTY100",
    value: "$100",
    purchasedBy: "Jennifer Smith",
    recipient: "Sarah Johnson",
    purchaseDate: "2023-08-15",
    redemptionStatus: "active",
    balance: "$100"
  },
  {
    id: "gc2",
    code: "STYLE50",
    value: "$50",
    purchasedBy: "Michael Brown",
    recipient: "David Wilson",
    purchaseDate: "2023-09-01",
    redemptionStatus: "partial",
    balance: "$25"
  },
  {
    id: "gc3",
    code: "SALON200",
    value: "$200",
    purchasedBy: "Emily Davis",
    recipient: "Jessica White",
    purchaseDate: "2023-10-10",
    redemptionStatus: "redeemed",
    balance: "$0"
  }
];

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState(MOCK_PROMOTIONS);
  const [giftCards, setGiftCards] = useState(MOCK_GIFT_CARDS);
  const [isAddingPromotion, setIsAddingPromotion] = useState(false);
  const [isAddingGiftCard, setIsAddingGiftCard] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'discount',
    value: '',
    description: '',
    validFrom: '',
    validTo: '',
    services: [] as string[],
    status: 'active'
  });
  
  const [newGiftCard, setNewGiftCard] = useState({
    value: '',
    purchasedBy: '',
    recipient: '',
    message: ''
  });
  
  // Mock services list
  const SERVICES = [
    "Haircut & Style", "Color & Style", "Blowout", "Manicure", 
    "Pedicure", "Facial", "All Services"
  ];

  // Set current date on component load
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    setNewPromotion(prev => ({
      ...prev,
      validFrom: today,
      validTo: today
    }));
  }, []);
  
  const handleAddPromotion = () => {
    if (!newPromotion.name || !newPromotion.value || !newPromotion.validFrom || !newPromotion.validTo) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const newPromotionWithId = {
      ...newPromotion,
      id: `p${promotions.length + 1}`,
      redemptions: 0
    };
    
    setPromotions([...promotions, newPromotionWithId]);
    setNewPromotion({
      name: '',
      type: 'discount',
      value: '',
      description: '',
      validFrom: currentDate,
      validTo: currentDate,
      services: [],
      status: 'active'
    });
    
    setIsAddingPromotion(false);
    toast.success("Promotion added successfully!");
  };
  
  const handleDeletePromotion = (promotionId: string) => {
    const updatedPromotions = promotions.filter(promo => promo.id !== promotionId);
    setPromotions(updatedPromotions);
    toast.success("Promotion deleted");
  };
  
  const handleTogglePromotionStatus = (promotionId: string) => {
    const updatedPromotions = promotions.map(promo => 
      promo.id === promotionId 
        ? { ...promo, status: promo.status === 'active' ? 'inactive' : 'active' } 
        : promo
    );
    setPromotions(updatedPromotions);
    toast.success("Promotion status updated");
  };
  
  const handleAddGiftCard = () => {
    if (!newGiftCard.value || !newGiftCard.purchasedBy || !newGiftCard.recipient) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Generate a random code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const newGiftCardWithId = {
      ...newGiftCard,
      id: `gc${giftCards.length + 1}`,
      code: code,
      purchaseDate: new Date().toISOString().split('T')[0],
      redemptionStatus: 'active',
      balance: newGiftCard.value
    };
    
    setGiftCards([...giftCards, newGiftCardWithId]);
    setNewGiftCard({
      value: '',
      purchasedBy: '',
      recipient: '',
      message: ''
    });
    
    setIsAddingGiftCard(false);
    toast.success("Gift card created successfully!");
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold flex items-center">
              <Percent className="mr-2 h-5 w-5 text-primary" />
              Promotions & Gift Cards
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage special offers, discounts and gift cards
            </p>
          </div>
        </div>

        <Tabs defaultValue="promotions" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="giftCards">Gift Cards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="promotions" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Active Promotions</h2>
              <Dialog open={isAddingPromotion} onOpenChange={setIsAddingPromotion}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Promotion</DialogTitle>
                    <DialogDescription>
                      Set up a new promotion or special offer for your salon
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="promoName">Promotion Name*</Label>
                        <Input 
                          id="promoName" 
                          value={newPromotion.name} 
                          onChange={e => setNewPromotion({...newPromotion, name: e.target.value})}
                          placeholder="Summer Special" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="promoType">Type*</Label>
                        <Select 
                          value={newPromotion.type} 
                          onValueChange={value => setNewPromotion({...newPromotion, type: value})}
                        >
                          <SelectTrigger id="promoType">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="discount">Discount</SelectItem>
                            <SelectItem value="package">Package Deal</SelectItem>
                            <SelectItem value="freebie">Free Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="promoValue">Value*</Label>
                        <Input 
                          id="promoValue" 
                          value={newPromotion.value} 
                          onChange={e => setNewPromotion({...newPromotion, value: e.target.value})}
                          placeholder={newPromotion.type === 'discount' ? "25%" : "$75"} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="promoServices">Applicable Services*</Label>
                        <Select 
                          value={newPromotion.services[0] || ''} 
                          onValueChange={value => setNewPromotion({...newPromotion, services: [value]})}
                        >
                          <SelectTrigger id="promoServices">
                            <SelectValue placeholder="Select services" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICES.map(service => (
                              <SelectItem key={service} value={service}>{service}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="validFrom">Valid From*</Label>
                        <Input 
                          id="validFrom" 
                          type="date" 
                          value={newPromotion.validFrom} 
                          onChange={e => setNewPromotion({...newPromotion, validFrom: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="validTo">Valid To*</Label>
                        <Input 
                          id="validTo" 
                          type="date" 
                          value={newPromotion.validTo} 
                          onChange={e => setNewPromotion({...newPromotion, validTo: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="promoDescription">Description</Label>
                      <Textarea 
                        id="promoDescription" 
                        value={newPromotion.description} 
                        onChange={e => setNewPromotion({...newPromotion, description: e.target.value})}
                        placeholder="Describe your promotion in detail" 
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="promoStatus" 
                        checked={newPromotion.status === 'active'} 
                        onCheckedChange={checked => setNewPromotion({...newPromotion, status: checked ? 'active' : 'inactive'})}
                      />
                      <Label htmlFor="promoStatus">Activate promotion immediately</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingPromotion(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPromotion}>
                      Create Promotion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {promotions.filter(promo => promo.status === 'active').map((promotion) => (
                <Card key={promotion.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{promotion.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {promotion.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Value</p>
                      <p className="text-lg font-bold text-primary">{promotion.value}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-muted-foreground capitalize">{promotion.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Valid Period</p>
                      <p className="text-muted-foreground flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{formatDate(promotion.validFrom)} - {formatDate(promotion.validTo)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Redemptions</p>
                      <p className="text-muted-foreground">{promotion.redemptions} uses</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-wrap gap-1">
                        {promotion.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/5">
                            {service}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive"
                          onClick={() => handleDeletePromotion(promotion.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {promotions.filter(promo => promo.status === 'scheduled').length > 0 && (
                <>
                  <h2 className="text-lg font-medium mt-6">Upcoming Promotions</h2>
                  <div className="space-y-4">
                    {promotions.filter(promo => promo.status === 'scheduled').map((promotion) => (
                      <Card key={promotion.id} className="border-dashed">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{promotion.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {promotion.description}
                              </CardDescription>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              Scheduled
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium">Value</p>
                              <p className="text-lg font-bold text-primary">{promotion.value}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Type</p>
                              <p className="text-muted-foreground capitalize">{promotion.type}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Valid Period</p>
                              <p className="text-muted-foreground flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{formatDate(promotion.validFrom)} - {formatDate(promotion.validTo)}</span>
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Starts In</p>
                              <p className="text-muted-foreground flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>7 days</span>
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="flex justify-between items-center w-full">
                            <div className="flex flex-wrap gap-1">
                              {promotion.services.map((service, index) => (
                                <Badge key={index} variant="outline" className="bg-primary/5">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleTogglePromotionStatus(promotion.id)}
                              >
                                Activate Now
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </>
              )}
              
              {promotions.filter(promo => promo.status === 'expired').length > 0 && (
                <>
                  <h2 className="text-lg font-medium mt-6">Expired Promotions</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Valid Period</TableHead>
                        <TableHead>Redemptions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotions.filter(promo => promo.status === 'expired').map((promotion) => (
                        <TableRow key={promotion.id}>
                          <TableCell className="font-medium">{promotion.name}</TableCell>
                          <TableCell>{promotion.value}</TableCell>
                          <TableCell>{formatDate(promotion.validFrom)} - {formatDate(promotion.validTo)}</TableCell>
                          <TableCell>{promotion.redemptions}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Renew</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="giftCards" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Gift Cards</h2>
              <Dialog open={isAddingGiftCard} onOpenChange={setIsAddingGiftCard}>
                <DialogTrigger asChild>
                  <Button>
                    <Gift className="h-4 w-4 mr-2" />
                    Create Gift Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Gift Card</DialogTitle>
                    <DialogDescription>
                      Issue a new gift card for a customer
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="giftCardValue">Value*</Label>
                        <Input 
                          id="giftCardValue" 
                          value={newGiftCard.value} 
                          onChange={e => setNewGiftCard({...newGiftCard, value: e.target.value})}
                          placeholder="$100" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="purchasedBy">Purchased By*</Label>
                        <Input 
                          id="purchasedBy" 
                          value={newGiftCard.purchasedBy} 
                          onChange={e => setNewGiftCard({...newGiftCard, purchasedBy: e.target.value})}
                          placeholder="Customer name" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="recipient">Recipient*</Label>
                      <Input 
                        id="recipient" 
                        value={newGiftCard.recipient} 
                        onChange={e => setNewGiftCard({...newGiftCard, recipient: e.target.value})}
                        placeholder="Recipient name" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="giftMessage">Gift Message (Optional)</Label>
                      <Textarea 
                        id="giftMessage" 
                        value={newGiftCard.message} 
                        onChange={e => setNewGiftCard({...newGiftCard, message: e.target.value})}
                        placeholder="Add a personal message" 
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingGiftCard(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddGiftCard}>
                      Create Gift Card
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Gift Card Management</CardTitle>
                <CardDescription>
                  Track and manage issued gift cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {giftCards.map((giftCard) => (
                      <TableRow key={giftCard.id}>
                        <TableCell className="font-medium">{giftCard.code}</TableCell>
                        <TableCell>{giftCard.value}</TableCell>
                        <TableCell>{giftCard.recipient}</TableCell>
                        <TableCell>{formatDate(giftCard.purchaseDate)}</TableCell>
                        <TableCell>
                          <Badge className={`${
                            giftCard.redemptionStatus === 'active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : giftCard.redemptionStatus === 'partial'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                : 'bg-red-100 text-red-800 hover:bg-red-100'
                          }`}>
                            {giftCard.redemptionStatus === 'active' 
                              ? 'Active' 
                              : giftCard.redemptionStatus === 'partial' 
                                ? 'Partially Used' 
                                : 'Redeemed'}
                          </Badge>
                        </TableCell>
                        <TableCell>{giftCard.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gift Card Settings</CardTitle>
                <CardDescription>
                  Configure gift card options for your salon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Enable Gift Cards</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to purchase gift cards
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Online Redemption</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to redeem gift cards online
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications to gift card recipients
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Custom Designs</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow customized gift card designs
                    </p>
                  </div>
                  <Switch checked={false} />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Expiration Date</h3>
                    <p className="text-sm text-muted-foreground">
                      Set gift cards to expire after a certain period
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={false} />
                    <Select disabled defaultValue="12">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Months" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Promotions;
