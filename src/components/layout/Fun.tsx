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
  },
  {
    title: "Snake",
    description: "Eat the food and grow your snake, but don't hit the walls!",
    image: "/games/snake.svg",
    component: <Snake />,
  },
  {
    title: "Clicker",
    description: "Click the button as many times as you can.",
    image: "/games/clicker.svg",
    component: <Clicker />,
  },
];

const Fun = () => {
  const [selectedGame, setSelectedGame] = useState<React.ReactNode | null>(null);

  const openModal = (gameComponent: React.ReactNode) => {
    setSelectedGame(gameComponent);
  };

  const closeModal = () => {
    setSelectedGame(null);
  };

  return (
    <section id="fun" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Fun Zone</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <GameCard
              key={index}
              title={game.title}
              description={game.description}
              image={game.image}
              onClick={() => openModal(game.component)}
            />
          ))}
        </div>
      </div>
      {selectedGame && <Modal onClose={closeModal}>{selectedGame}</Modal>}
    </section>
  );
};

export default Fun;
