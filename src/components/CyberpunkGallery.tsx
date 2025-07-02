
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

const images = [
  {
    url: "https://i.postimg.cc/HrLnNXfB/a-27-year-old-man-leans-against-an-old-brick-wall-in-a-dark-alley-red-neon-light-casting-a-dramatic.png",
    title: "Neon Alley",
    description: "Cyberpunk atmosphere with dramatic red lighting"
  },
  {
    url: "https://i.postimg.cc/T5XhNS6D/a-27-year-old-man-leans-against-an-old-brick-wall-in-a-dark-alley-red-neon-light-casting-a-dramatic.png",
    title: "Urban Shadow",
    description: "Dark alley with cinematic neon ambiance"
  },
  {
    url: "https://i.postimg.cc/xc5qgtFX/a-27-year-old-man-leans-against-an-old-brick-wall-in-a-dark-alley-red-neon-light-casting-a-dramatic.png",
    title: "Digital Dreams",
    description: "Futuristic street scene with red glow"
  }
];

const CyberpunkGallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div id="gallery-section" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          <span className="neon-text">Visual Inspiration</span>
        </h2>
        <p className="text-gray-400 text-lg">
          The cyberpunk aesthetic that drives our audio technology
        </p>
      </div>

      {/* Main Gallery Display */}
      <div className="max-w-4xl mx-auto mb-8">
        <Card className="cyber-card overflow-hidden relative group">
          <div className="relative aspect-video">
            <img
              src={images[currentImage].url}
              alt={images[currentImage].title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 via-transparent to-transparent" />
            
            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-cyber-dark/70 hover:bg-cyber-red/80 border-cyber-red/30"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-cyber-dark/70 hover:bg-cyber-red/80 border-cyber-red/30"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* View Full Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-cyber-dark/70 hover:bg-cyber-red/80 border-cyber-red/30"
              onClick={() => setIsModalOpen(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full
            </Button>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {images[currentImage].title}
              </h3>
              <p className="text-gray-300">
                {images[currentImage].description}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
              currentImage === index 
                ? 'ring-2 ring-cyber-red scale-110' 
                : 'hover:scale-105 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-20 h-12 object-cover"
            />
            <div className="absolute inset-0 bg-cyber-red/20" />
          </button>
        ))}
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={images[currentImage].url}
              alt={images[currentImage].title}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-cyber-dark/70 hover:bg-cyber-red/80"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberpunkGallery;
