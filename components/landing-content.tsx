"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

const testimonials = [
  {
    name: "Shubham Kumar",
    avatar: "SK",
    title: "Software Engg.",
    description: "This is a best application I've used!",
  },
  {
    name: "Rajkishore Kandle",
    avatar: "RK",
    title: "Engineering Manger",
    description: "This is a best application I've used!",
  },

  {
    name: "Dilip Sejwani",
    avatar: "DS",
    title: "Tech Lead",
    description: "This is a best application I've used!",
  },
  {
    name: "Ajay Yadav",
    avatar: "AY",
    title: "Senior Tech Lead",
    description: "This is a best application I've used!",
  },
];

const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h1 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <Avatar className="text-purple-500">
                  <AvatarFallback>{item.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LandingContent;
