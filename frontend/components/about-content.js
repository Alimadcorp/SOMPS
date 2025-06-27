"use client";

import { useState, useEffect } from "react";
import { Search, Code2, Users, Zap } from "lucide-react";
import Link from "next/link";
import Container from "@/components/container";
import ProjectCard from "@/components/projectCard";
import StatsDashboard from "@/components/stats";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function AboutContent() {
  const [project, setp] = useState({});
  const [stat, sets] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/project/${Math.floor(Math.random() * 2500)}`
        );
        const res2 = await fetch(`/api/stats`);
        const data = await res.json();
        const statt = await res2.json();
        setp(data);
        sets(statt);
      } catch (error) {
        console.error("Error fetching data:", error);
        const res = await fetch(`/api/project/12`);

        const data = await res.json();

        setp(data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={"min-h-screen bg-background "+`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <header className="border-b border-border">
        <Container>
          <div className="flex items-center justify-between py-2">
            <Link href="/" className="group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary transition-all duration-200">
                SOMPS
              </h1>
            </Link>
            <nav className="flex items-center gap-5">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Search
              </Link>
              <Link href="/about" className="text-foreground font-medium">
                About
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <div className="py-5 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About SOMPS</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Summer Of Making Projects Search - Search and discover projects
              from the HackClub Summer of Making event
            </p>
            <p className="text-l text-muted-foreground max-w-2xl mx-auto mb-8">
              A project by Muhammad Ali, submission to the Reactive YSWS from HackClub
              This project uses the Alimad Surviellance Search Algorithm. The algorithm
              will be released as an open source library soon...
            </p>
          </div>
        </Container>
        <Container>
          <div className="mt-4">
            <h2 className="text-3xl font-bold mb-1 text-center">
              Stats
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Loading stats...
                </p>
              </div>
            ) : (
              <StatsDashboard stats={stat}></StatsDashboard>
            )}
          </div>
        </Container>
        <Container>
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Random Project
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Here's some a random project shown for absolutely no reason
            </p>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Loading random project...
                </p>
              </div>
            ) : (
              <ProjectCard project={project} highlight={""}></ProjectCard>
            )}
          </div>
        </Container>
        <Container>
          <div className="text-center py-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-4">Ready to Discover???</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start searching through thousands of amazing projects created by
              the HackClubbers.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Search className="h-4 w-4" />
              Start Searching
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
