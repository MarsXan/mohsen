"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Github, Layers, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert("Form submitted! This would normally send an email.")
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get In Touch</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Have a project in mind? Let's discuss how I can help.
          </p>
        </div>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 md:grid-cols-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Feel free to reach out through any of these channels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href="mailto:m.balestani@gmail.com" className="hover:underline">
                  m.balestani@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href="tel:+989353361996" className="hover:underline">
                  +98 935 336 1996
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Tehran, Iran (open to remote)</span>
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <a href="https://www.linkedin.com/in/mohsen-mokhtari/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn Profile
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-muted-foreground" />
                <a href="https://github.com/MarsXan/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  GitHub Profile
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-muted-foreground" />
                <a href="https://stackoverflow.com/users/5892896/mohsen-mokhtari" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Stack Overflow Profile
                </a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>I'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message" className="min-h-[120px]" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

