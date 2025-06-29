import React, { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles';
import type { Container, Engine } from 'tsparticles';

interface ParticleBackgroundProps {
  weatherCondition?: string;
  isNight?: boolean;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  weatherCondition = 'clear', 
  isNight = false 
}) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Particles loaded callback
  }, []);

  const getParticleConfig = () => {
    const baseConfig = {
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
          resize: true,
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: ["#ff0000", "#ff8000", "#ffff00", "#80ff00", "#00ff00", "#00ff80", "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"],
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: false,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: "none" as const,
          enable: true,
          outModes: {
            default: "bounce" as const,
          },
          random: true,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: 0.7,
          random: true,
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.1,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 8 },
          random: true,
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.5,
            sync: false,
          },
        },
      },
      detectRetina: true,
    };

    // Weather-specific particle configurations
    switch (weatherCondition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: ["#00bfff", "#1e90ff", "#4169e1", "#0000cd", "#191970"],
            },
            move: {
              ...baseConfig.particles.move,
              direction: "bottom" as const,
              speed: 6,
              angle: {
                offset: 0,
                value: 180,
              },
            },
            shape: {
              type: "line",
            },
            size: {
              value: { min: 0.5, max: 3 },
            },
            number: {
              ...baseConfig.particles.number,
              value: 150,
            },
          },
        };

      case 'snow':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: ["#ffffff", "#f0f8ff", "#e6f3ff", "#ddeeff"],
            },
            move: {
              ...baseConfig.particles.move,
              direction: "bottom" as const,
              speed: 2,
              random: true,
            },
            shape: {
              type: ["circle", "triangle"],
            },
            size: {
              value: { min: 2, max: 6 },
            },
            number: {
              ...baseConfig.particles.number,
              value: 100,
            },
          },
        };

      case 'thunderstorm':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: ["#ffff00", "#ffd700", "#ffb347", "#ff6347", "#8a2be2"],
            },
            move: {
              ...baseConfig.particles.move,
              speed: 4,
              random: true,
            },
            opacity: {
              ...baseConfig.particles.opacity,
              animation: {
                enable: true,
                speed: 3,
                minimumValue: 0.1,
                sync: false,
              },
            },
            size: {
              value: { min: 2, max: 10 },
              animation: {
                enable: true,
                speed: 5,
                minimumValue: 1,
                sync: false,
              },
            },
            number: {
              ...baseConfig.particles.number,
              value: 60,
            },
          },
        };

      case 'clouds':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: ["#87ceeb", "#b0c4de", "#d3d3d3", "#dcdcdc", "#f5f5f5"],
            },
            move: {
              ...baseConfig.particles.move,
              speed: 1.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 3, max: 12 },
            },
            opacity: {
              value: 0.4,
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.1,
                sync: false,
              },
            },
            number: {
              ...baseConfig.particles.number,
              value: 40,
            },
          },
        };

      default: // Clear weather - full rainbow
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: [
                "#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", 
                "#bfff00", "#80ff00", "#40ff00", "#00ff00", "#00ff40",
                "#00ff80", "#00ffbf", "#00ffff", "#00bfff", "#0080ff",
                "#0040ff", "#0000ff", "#4000ff", "#8000ff", "#bf00ff",
                "#ff00ff", "#ff00bf", "#ff0080", "#ff0040"
              ],
            },
            move: {
              ...baseConfig.particles.move,
              speed: isNight ? 1.5 : 2.5,
            },
            number: {
              ...baseConfig.particles.number,
              value: isNight ? 60 : 100,
            },
            size: {
              value: { min: 2, max: isNight ? 6 : 10 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 1,
                sync: false,
              },
            },
          },
        };
    }
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={getParticleConfig()}
      className="absolute inset-0 pointer-events-none"
    />
  );
};