"use client";
import React, { useState } from "react";
import GameCard from "./GameCard";
import Modal from "./Modal";
import DinoRun from "../games/DinoRun";
import Snake from "../games/Snake";
import Clicker from "../games/Clicker";

const games = [
    {
      title: "Dino Run",
      description: "Jump over obstacles and see how long you can survive.",
      image: "/games/dino.svg",
      component: <DinoRun />,
      instructions: "Press the Space bar to jump. Press it again in the air to double jump.",
    },
    {
      title: "Snake",
      description: "Eat the food and grow your snake, but don't hit the walls!",
      image: "/games/snake.svg",
      component: <Snake />,
      instructions: "Use the Arrow keys to control the snake. Eat the red food to grow.",
    },
    {
      title: "Clicker",
      description: "Click the button as many times as you can.",
      image: "/games/clicker.svg",
      component: <Clicker />,
      instructions: "Click the button as many times as you can in 15 seconds.",
    },
  ];

  type Game = (typeof games)[0];

  const Fun = () => {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const openModal = (game: Game) => {
      setSelectedGame(game);
    };

    const closeModal = () => {
      setSelectedGame(null);
    };

    return (
      <section id="fun" className="py-16 space-bg relative">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Fun Zone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <GameCard
                key={index}
                title={game.title}
                description={game.description}
                image={game.image}
                onClick={() => openModal(game)}
              />
            ))}
          </div>
        </div>
        {selectedGame && (
          <Modal onClose={closeModal} instructions={selectedGame.instructions}>
            {selectedGame.component}
          </Modal>
        )}
      </section>
    );
  };

export default Fun;
