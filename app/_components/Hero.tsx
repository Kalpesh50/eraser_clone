import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-neutral-900 via-gray-900 to-neutral-900 text-white">
      <div className="absolute w-full flex justify-between px-4 md:px-20 top-20">
        <div className="flex items-center justify-center w-40 h-40 rounded-full">
          <Image
            src="/diagramascode.svg"
            alt="Diagram as Code"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        <div className="absolute left-1/4 -translate-x-1/2 top-80">
          <Image
            src="/aidiagrams.svg"
            alt="AI Diagrams"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        <div className="flex items-center justify-center w-40 h-40 rounded-lg ">
          <Image
            src="/documents and diagram.svg"
            alt="Documents & Diagrams"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute top-28 w-full justify-center flex">
        <div className="py-2 px-2 rounded-3xl border-t-[1.5px] border-l-2 border-white/20 bg-white/20 cursor-pointer shadow-lg">
          <p className="mx-auto text-white text-sm">
            See what's new |{" "}
            <span className="text-sky-500">AI Diagrams {">"} </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-8 py-32 lg:flex lg:h-200 lg:items-center">
        <div className="mx-auto max-w-3xl mt-8 text-center">
          <h1 className="bg-gradient-to-r from-blue-300 via-blue-500 to-purple-600 bg-clip-text p-2 text-5xl font-extrabold text-transparent ">
            Documents & diagrams
          </h1>
          <p className="sm:block text-5xl font-semibold">
            {" "}
            for engineering teams{" "}
          </p>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            All-in-one markdown editor, collaborative canvas, and
            diagram-as-code builder
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LoginLink className="flex items-center w-full rounded-lg border border-white bg-neutral-100 px-4 py-2 text-sm font-medium text-black hover:bg-neutral-300 hover:text-neutral-900 focus:outline-none focus:ring active:text-opacity-75 sm:w-auto">
              Get Started
              <p className="ml-2">
                <ArrowRight size={24} />
              </p>
            </LoginLink>
          </div>
          
        </div>
      
      </div>
      <div className="mt-10">
        <Image src={"/hero.avif"} alt="hero" width={1500} height={1500} />
      </div>

      <div className="mt-10 flex justify-center">
        <Image src={"/hero3.png"} alt="hero" width={1000} height={1000} />
      </div>
    </section>
  );
};

export default Hero;
