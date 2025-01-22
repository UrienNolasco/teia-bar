"use client";
/* eslint-disable react/react-in-jsx-scope */


import { useSession } from "next-auth/react";

const UserName = () => {
  const { data } = useSession();

  return (
    <div>
      {data?.user ? (
        <h2 className="text-base font-bold">Olá, {data.user.name}! O que você deseja beber hoje?</h2>
      ) : (
        <h2 className="text-base font-bold">Olá, faça seu login!</h2>
      )}
    </div>
  );
};

export default UserName;