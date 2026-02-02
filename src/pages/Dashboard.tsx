import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wallet, ArrowDownToLine, Pencil, Trash2, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  getWallets,
  createWallet,
  updateWalletName,
  fundWallet,
  deleteWallet,
  offrampWallet,
  WalletInfo,
} from '@/lib/api';

interface WalletDisplay extends WalletInfo {
  id: string;
}

export default function Dashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [wallets, setWallets] = useState<WalletDisplay[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<WalletDisplay | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchWallets = async () => {
    setIsLoadingWallets(true);
    const { data, error } = await getWallets();
    
    if (error) {
      toast({
        title: 'Error fetching wallets',
        description: error,
        variant: 'destructive',
      });
      setIsLoadingWallets(false);
      return;
    }

    if (data?.wallets) {
      setWallets(data.wallets.map(w => ({
        ...w,
        id: w.wallet_name, // Use wallet_name as ID since it's unique
      })));
    }
    setIsLoadingWallets(false);
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleCreateWallet = async () => {
    if (!newWalletName.trim()) return;
    
    setIsLoading(true);
    const { error } = await createWallet(newWalletName.trim());
    
    if (error) {
      toast({
        title: 'Error creating wallet',
        description: error,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    await fetchWallets();
    setCreateDialogOpen(false);
    setNewWalletName('');
    setIsLoading(false);
    toast({ title: 'Wallet created', description: 'Your new wallet is ready to use.' });
  };

  const handleRenameWallet = async () => {
    if (!selectedWallet || !newWalletName.trim()) return;
    
    setIsLoading(true);
    const { error } = await updateWalletName(selectedWallet.wallet_name, newWalletName.trim());
    
    if (error) {
      toast({
        title: 'Error renaming wallet',
        description: error,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    await fetchWallets();
    setRenameDialogOpen(false);
    setNewWalletName('');
    setSelectedWallet(null);
    setIsLoading(false);
    toast({ title: 'Wallet renamed', description: 'Wallet name updated successfully.' });
  };

  const handleFundWallet = async () => {
    if (!selectedWallet || !fundAmount) return;
    
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setIsLoading(true);
    // userId would come from decoded JWT in a real app - using 0 as placeholder
    const { error } = await fundWallet(selectedWallet.wallet_name, amount, 0);
    
    if (error) {
      toast({
        title: 'Error funding wallet',
        description: error,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    await fetchWallets();
    setFundDialogOpen(false);
    setFundAmount('');
    setSelectedWallet(null);
    setIsLoading(false);
    toast({ title: 'Wallet funded', description: `Added $${amount.toFixed(2)} to your wallet.` });
  };

  const handleOfframp = async (wallet: WalletDisplay) => {
    setIsLoading(true);
    const { error } = await offrampWallet(wallet.wallet_name);
    
    if (error) {
      toast({
        title: 'Error processing off-ramp',
        description: error,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    await fetchWallets();
    setIsLoading(false);
    toast({ title: 'Off-ramp initiated', description: `$${wallet.holding_amount.toFixed(2)} will be transferred to your bank account.` });
  };

  const handleDeleteWallet = async (wallet: WalletDisplay) => {
    setIsLoading(true);
    const { error } = await deleteWallet(wallet.wallet_name);
    
    if (error) {
      toast({
        title: 'Error deleting wallet',
        description: error,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    await fetchWallets();
    setIsLoading(false);
    toast({ title: 'Wallet deleted', description: 'Wallet has been removed.' });
  };

  const openRenameDialog = (wallet: WalletDisplay) => {
    setSelectedWallet(wallet);
    setNewWalletName(wallet.wallet_name);
    setRenameDialogOpen(true);
  };

  const openFundDialog = (wallet: WalletDisplay) => {
    setSelectedWallet(wallet);
    setFundAmount('');
    setFundDialogOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 bg-muted/30">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Wallets</h1>
              <p className="text-muted-foreground">
                {user?.email ? `Logged in as ${user.email}` : 'Manage your API wallets and track your earnings'}
              </p>
            </div>
            
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Wallet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Wallet</DialogTitle>
                  <DialogDescription>
                    Give your wallet a name to identify it in your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-name">Wallet Name</Label>
                    <Input
                      id="wallet-name"
                      placeholder="e.g., Production API"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateWallet} disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {isLoadingWallets ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : wallets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet, index) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors glow-card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openRenameDialog(wallet)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWallet(wallet)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {wallet.wallet_name}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(wallet.id)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono group/copy mb-4"
                    >
                      <span>{wallet.id.slice(0, 8)}...</span>
                      {copiedId === wallet.id ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                      )}
                    </button>
                    
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Balance</p>
                      <p className="text-3xl font-bold text-primary">
                        ${wallet.holding_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => openFundDialog(wallet)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Fund
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleOfframp(wallet)}
                        disabled={wallet.holding_amount === 0}
                      >
                        <ArrowDownToLine className="w-4 h-4 mr-1" />
                        Off-ramp
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No wallets yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first wallet to start accepting payments
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Wallet
            </Button>
          </motion.div>
        )}

        {/* Rename Dialog */}
        <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Wallet</DialogTitle>
              <DialogDescription>
                Enter a new name for your wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rename-wallet">New Name</Label>
                <Input
                  id="rename-wallet"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenameWallet} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Fund Dialog */}
        <Dialog open={fundDialogOpen} onOpenChange={setFundDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fund Wallet</DialogTitle>
              <DialogDescription>
                Add funds to {selectedWallet?.wallet_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fund-amount">Amount (USD)</Label>
                <Input
                  id="fund-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFundDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFundWallet} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fund Wallet'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
