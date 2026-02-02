import { motion } from 'framer-motion';
import { UserPlus, Code, Wallet, CreditCard } from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your Dot Payments account and get your unique ID.',
  },
  {
    icon: Code,
    title: 'Add the Middleware',
    description: 'Simply sign up and add the middleware to your backend. It takes less than 5 minutes.',
    hasCode: true,
  },
  {
    icon: Wallet,
    title: 'Create Wallets',
    description: 'Set up wallets for your APIs. Each wallet handles payments independently.',
  },
  {
    icon: CreditCard,
    title: 'Accept Payments',
    description: 'Start accepting fiat payments that settle on-chain via the X402 protocol.',
  },
];

const codeExample = `from fastapi import FastAPI
from dotpayments import DotPaymentsMiddleware

app = FastAPI()

# Add Dot Payments middleware
app.add_middleware(
    DotPaymentsMiddleware,
    uuid="YOUR_DOT_PAYMENT_UUID"
)

@app.get("/premium-endpoint")
async def premium_content():
    return {"data": "This is paid content"}`;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 relative bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">How It </span>
            <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get up and running in minutes. No complex setup, no blockchain expertise required.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Step {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Code block */}
          <div className="lg:sticky lg:top-24">
            <CodeBlock code={codeExample} language="python" />
          </div>
        </div>
      </div>
    </section>
  );
}
