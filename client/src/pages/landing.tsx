import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Shield,
  Zap,
  Clock,
  Smartphone,
  Bot,
  ChevronRight,
  Star,
  Globe,
  Lock,
  Phone,
  Mail,
  Building2,
  Wifi,
  Crown,
  CheckCircle2,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const features = [
  {
    icon: Bot,
    title: "Smart Auto-Reply",
    description: "AI-powered automatic responses that handle conversations while you're away.",
  },
  {
    icon: Shield,
    title: "Anti-Spam Protection",
    description: "Advanced filters to block unwanted messages and keep your chats clean.",
  },
  {
    icon: Clock,
    title: "Message Scheduler",
    description: "Schedule messages to be sent at the perfect time, every time.",
  },
  {
    icon: Smartphone,
    title: "Media Downloader",
    description: "Automatically download and organize media from your conversations.",
  },
  {
    icon: Globe,
    title: "Group Manager",
    description: "Powerful tools to manage groups, set rules, and moderate members.",
  },
  {
    icon: Zap,
    title: "Instant Connect",
    description: "Link your WhatsApp in seconds using QR code or pairing code.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <SiWhatsapp className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight" data-testid="text-brand-name">NX-MD BOT</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" data-testid="link-login">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" data-testid="link-register">
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
                <Star className="w-3.5 h-3.5 mr-1.5" />
                WhatsApp Automation Platform
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6"
            >
              Automate Your
              <span className="text-primary block mt-1">WhatsApp Experience</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Connect your WhatsApp, enable powerful bot features, and let NX-MD BOT
              handle your messages intelligently. No coding required.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="px-8 text-base" data-testid="button-hero-start">
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  Start For KSh 70/month
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8 text-base" data-testid="button-hero-login">
                  I Have an Account
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl border border-border bg-card p-2 shadow-xl overflow-hidden">
              <div className="rounded-xl bg-background overflow-hidden">
                <div className="border-b border-border/50 bg-background/80 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                      <SiWhatsapp className="text-primary-foreground w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-sm">NX-MD BOT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:block">Dashboard</span>
                    <div className="w-6 h-6 rounded-full bg-muted" />
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-border/50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Wifi className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">WhatsApp</p>
                          <p className="font-semibold text-xs text-green-500">Connected</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Crown className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Subscription</p>
                          <p className="font-semibold text-xs">28 days left</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Bot Status</p>
                          <p className="font-semibold text-xs">Active</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Number</p>
                          <p className="font-semibold text-xs">2547•••••850</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Subscription Progress</span>
                      <span className="text-[10px] text-muted-foreground">Expires Apr 08, 2026</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[93%] rounded-full bg-primary" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/50 p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="font-semibold text-sm">WhatsApp Connected</p>
                    <p className="text-xs text-muted-foreground">Number: 254712345678</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/50 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Auto Reply</span>
                      </div>
                      <div className="w-8 h-4 rounded-full bg-primary" />
                    </div>
                    <div className="rounded-xl border border-border/50 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Shield className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Anti-Spam</span>
                      </div>
                      <div className="w-8 h-4 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Features
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to automate and manage your WhatsApp with ease.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeUp}>
                <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-colors duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in three simple steps.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                icon: Lock,
                title: "Create Account",
                desc: "Register with your email and set up your secure account in seconds.",
              },
              {
                step: "02",
                icon: MessageSquare,
                title: "Link WhatsApp",
                desc: "Scan QR code or use pairing code to connect your WhatsApp device.",
              },
              {
                step: "03",
                icon: Zap,
                title: "Activate Bot",
                desc: "Pay KSh 70, enable features, and let the bot work for you 24/7.",
              },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp}>
                <div className="text-center">
                  <div className="relative inline-flex">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Automate?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-8">
              Join thousands of users who trust NX-MD BOT for their WhatsApp automation needs.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/register">
                <Button size="lg" className="px-10 text-base" data-testid="button-cta-register">
                  Get Started Now
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50" id="contact">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Contact Us
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Need help or have questions? Reach out to our team.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp}>
              <Card className="h-full border-border/50 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:0758891491" className="text-primary text-sm hover:underline" data-testid="link-contact-phone">
                    0758891491
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="h-full border-border/50 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <SiWhatsapp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <a
                    href="https://wa.me/254758891491"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline"
                    data-testid="link-contact-whatsapp"
                  >
                    Chat with us
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="h-full border-border/50 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Company</h3>
                  <p className="text-primary text-sm" data-testid="text-company-name">Nutterx Technologies</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <SiWhatsapp className="text-primary-foreground w-4 h-4" />
                </div>
                <span className="font-bold text-lg">NX-MD BOT</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                WhatsApp automation platform by Nutterx Technologies. Automate your messaging with powerful bot features.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/register" className="hover:text-primary transition-colors">Get Started</Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-primary transition-colors">Sign In</Link>
                </li>
                <li>
                  <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contact Info</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <a href="tel:0758891491" className="hover:text-primary transition-colors">0758891491</a>
                </li>
                <li className="flex items-center gap-2">
                  <SiWhatsapp className="w-3.5 h-3.5" />
                  <a href="https://wa.me/254758891491" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp Support</a>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Nutterx Technologies</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} NX-MD BOT by Nutterx Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
