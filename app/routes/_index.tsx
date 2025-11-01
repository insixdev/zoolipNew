import { Link } from "react-router";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar/SidebarContainer";
import Button from "~/components/ui/button/Button&Link/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
} from "lucide-react";
import TrendingSection from "~/components/community/TrendingSection";

// Agregar estilos para ocultar la barra de desplazamiento
const scrollbarStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

type Post = {
  id: string;
  type: "image" | "text";
  content: string;
  image?: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
};

// Static data - Social media style posts
const posts: Post[] = [
  {
    id: "1",
    type: "image",
    content:
      "¡Conoce a Luna! 🐕 Adoptada hace 2 semanas y ya es parte de la familia. Gracias a todos por sus consejos sobre cómo ayudarla a adaptarse. #AdopcionResponsable #NuevoMiembro",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop",
    author: {
      name: "María González",
      username: "@mariag",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    timestamp: "Hace 2 horas",
    likes: 142,
    comments: 23,
    shares: 8,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    type: "text",
    content:
      "Consejo del día: Si tu perro tiene ansiedad por separación, empieza con periodos cortos de ausencia y ve aumentando gradualmente. La paciencia es clave 🐾💙",
    author: {
      name: "Dr. Carlos Veterinario",
      username: "@drcarlosvet",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    timestamp: "Hace 5 horas",
    likes: 289,
    comments: 45,
    shares: 67,
    isLiked: true,
    isSaved: true,
  },
  {
    id: "3",
    type: "image",
    content:
      "Antes y después de la adopción 😍 Mira cómo ha cambiado Rocky en solo 3 meses. El amor lo es todo ❤️",
    image:
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=600&fit=crop",
    author: {
      name: "Juan Pérez",
      username: "@juanperez",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    timestamp: "Hace 1 día",
    likes: 567,
    comments: 89,
    shares: 34,
    isLiked: true,
    isSaved: false,
  },
  {
    id: "4",
    type: "text",
    content:
      "¿Alguien tiene experiencia con gatos persas? Acabo de adoptar uno y me encantaría recibir consejos sobre su cuidado especial 🐱",
    author: {
      name: "Ana Silva",
      username: "@anasilva",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    timestamp: "Hace 2 días",
    likes: 78,
    comments: 156,
    shares: 12,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "5",
    type: "image",
    content: "Día de spa para mi mejor amigo 🛁✨ #PetGrooming #HappyPet",
    image:
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&h=600&fit=crop",
    author: {
      name: "Laura Martínez",
      username: "@lauramtz",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    timestamp: "Hace 3 días",
    likes: 234,
    comments: 18,
    shares: 5,
    isLiked: false,
    isSaved: true,
  },
];

import FeedTabs, { EmptyFollowingState } from "~/components/community/FeedTabs";

export default function Community() {
  // Agregar estilos al head
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = scrollbarStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <CommunityNavbar />
      <SidebarContainer showSidebar={true} className="z-80" />

      <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Feed (center) - Centrado con margen a la izquierda */}
        <div className="md:col-start-4 md:col-span-5 w-full space-y-4">
          <FeedTabs>
            {(activeTab) => (
              <>
                {activeTab === "forYou" ? (
                  posts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 hover:border-orange-200 transition-all duration-200 hover:shadow-sm"
                    >
                      {/* Post Header */}
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-11 h-11">
                              <AvatarImage
                                src={post.author.avatar}
                                alt={post.author.name}
                              />
                              <AvatarFallback>
                                {post.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {post.author.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {post.author.username} · {post.timestamp}
                              </p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreHorizontal
                              size={20}
                              className="text-gray-600"
                            />
                          </button>
                        </div>
                      </CardHeader>

                      {/* Post Content */}
                      <CardContent className="pb-3">
                        <p className="text-gray-800 whitespace-pre-wrap mb-3">
                          {post.content}
                        </p>

                        {/* Post Image */}
                        {post.type === "image" && post.image && (
                          <div className="-mx-6 mb-3">
                            <img
                              src={post.image}
                              alt="Post"
                              className="w-full max-h-[500px] object-cover"
                            />
                          </div>
                        )}
                      </CardContent>

                      {/* Post Actions */}
                      <CardFooter className="pt-3 border-t">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-6">
                            {/* Like Button */}
                            <button className="flex items-center gap-2 group">
                              <Heart
                                size={22}
                                className={`transition-colors ${
                                  post.isLiked
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-600 group-hover:text-red-500"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  post.isLiked
                                    ? "text-red-500"
                                    : "text-gray-600"
                                }`}
                              >
                                {post.likes}
                              </span>
                            </button>

                            {/* Comment Button */}
                            <button className="flex items-center gap-2 group">
                              <MessageCircle
                                size={22}
                                className="text-gray-600 group-hover:text-blue-500 transition-colors"
                              />
                              <span className="text-sm font-medium text-gray-600">
                                {post.comments}
                              </span>
                            </button>

                            {/* Share Button */}
                            <button className="flex items-center gap-2 group">
                              <Share2
                                size={22}
                                className="text-gray-600 group-hover:text-green-500 transition-colors"
                              />
                              <span className="text-sm font-medium text-gray-600">
                                {post.shares}
                              </span>
                            </button>
                          </div>

                          {/* Bookmark Button */}
                          <button className="group">
                            <Bookmark
                              size={22}
                              className={`transition-colors ${
                                post.isSaved
                                  ? "fill-orange-500 text-orange-500"
                                  : "text-gray-600 group-hover:text-orange-500"
                              }`}
                            />
                          </button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <EmptyFollowingState />
                )}

                {/* Load More */}
                <div className="flex justify-center mt-8">
                  <button className="mt-4 bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors px-8 py-4">
                    Cargar más publicaciones
                  </button>
                </div>
              </>
            )}
          </FeedTabs>
        </div>

        {/* Sección de Tendencias y Sugerencias */}
        <aside className="hidden md:block md:col-start-10 md:col-span-3">
          <TrendingSection />
        </aside>
      </div>
    </div>
  );
}
