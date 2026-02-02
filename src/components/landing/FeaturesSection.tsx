import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Coins, Lock, BarChart } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Integration',
    description: 'Add one middleware to your backend. Works with FastAPI, Express, and more.',
  },
  {
    icon: Globe,
    title: 'Fiat First',
    description: 'Your customers pay in USD, EUR, or their preferred currency. No crypto needed.',
  },
  {
    icon: Shield,
    title: 'On-Chain Settlement',
    description: 'All transactions settle via the X402 protocol. Transparent and verifiable.',
  },
  {
    icon: Coins,
    title: 'Easy Off-Ramp',
    description: 'Withdraw your earnings to your bank account with one click.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption. SOC 2 compliant. Your funds are always safe.',
  },
  {
    icon: BarChart,
    title: 'Real-Time Analytics',
    description: 'Track transactions, revenue, and wallet balances in your dashboard.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Built for </span>
            <span className="text-primary">Developers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to accept payments and settle on-chain, without the complexity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors glow-card">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
