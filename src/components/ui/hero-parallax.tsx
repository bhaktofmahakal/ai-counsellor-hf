"use client";
import React from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    MotionValue,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export const HeroParallax = ({
    products,
}: {
    products: {
        title: string;
        link: string;
        thumbnail: string;
    }[];
}) => {
    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const [translateXRange, setTranslateXRange] = React.useState(800);

    React.useEffect(() => {
        const updateRange = () => {
            setTranslateXRange(window.innerWidth < 768 ? 400 : 800);
        };
        updateRange();
        window.addEventListener("resize", updateRange);
        return () => window.removeEventListener("resize", updateRange);
    }, []);

    const springConfig = { stiffness: 300, damping: 30, mass: 1, bounce: 0 };

    const translateXBase = useTransform(scrollYProgress, [0, 1], [0, translateXRange]);
    const translateXReverseBase = useTransform(scrollYProgress, [0, 1], [0, -translateXRange]);

    const translateX = useSpring(translateXBase, springConfig);
    const translateXReverse = useSpring(translateXReverseBase, springConfig);

    const rotateXBase = useTransform(scrollYProgress, [0, 0.5], [15, 0]);
    const rotateZBase = useTransform(scrollYProgress, [0, 0.5], [10, 0]);
    const translateYBase = useTransform(scrollYProgress, [0, 0.8], [-600, 200]);
    const opacityBase = useTransform(scrollYProgress, [0, 0.3], [0.1, 1]);

    const rotateX = useSpring(rotateXBase, springConfig);
    const rotateZ = useSpring(rotateZBase, springConfig);
    const translateY = useSpring(translateYBase, springConfig);
    const opacity = useSpring(opacityBase, springConfig);

    return (
        <div
            ref={ref}
            className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-black"
        >
            <Header />
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className=""
            >
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 md:space-x-20 mb-20">
                    {firstRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row mb-20 space-x-10 md:space-x-20 ">
                    {secondRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateXReverse}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 md:space-x-20">
                    {thirdRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export const Header = () => {
    return (
        <div className="max-w-7xl relative mx-auto py-10 md:py-20 px-6 w-full left-0 top-0 z-20 text-left">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white font-display leading-[1] md:leading-[0.9] tracking-tighter">
                Target the World&apos;s <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-500">Best Institutions</span>
            </h1>
            <p className="max-w-xl md:max-w-2xl text-base md:text-2xl mt-6 md:mt-8 text-neutral-500 md:text-neutral-400 font-light leading-relaxed">
                From the Ivy League to Oxbridge, our AI strategies have helped students secure seats at the most prestigious campuses globally.
            </p>
        </div>
    );
};

export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        title: string;
        link: string;
        thumbnail: string;
    };
    translate: MotionValue<number>;
}) => {
    const getLocalImage = (name: string) => {
        name = name.toLowerCase();
        if (name.includes("harvard")) return "harvard.jpg";
        if (name.includes("stanford")) return "stanford.jpg";
        if (name.includes("mit")) return "mit.jpg";
        if (name.includes("columbia")) return "columbia.jpg";
        if (name.includes("yale")) return "yale.jpg";
        if (name.includes("oxford")) return "oxford.jpg";
        if (name.includes("cambridge")) return "cambridge.jpg";
        if (name.includes("imperial")) return "imperial.jpg";
        if (name.includes("eth zurich")) return "ethzurich.jpg";
        if (name.includes("toronto")) return "toronto.jpg";
        if (name.includes("ucla")) return "ucla.jpg";
        if (name.includes("cornell")) return "cornell.jpg";
        if (name.includes("chicago")) return "chicago.jpg";
        if (name.includes("princeton")) return "princeton.jpg";
        if (name.includes("caltech")) return "caltech.jpg";
        if (name.includes("ucl")) return "ucl.jpg";
        return null;
    };

    const localImg = getLocalImage(product.title);
    const [imgSrc, setImgSrc] = React.useState(
        localImg ? `/images/universities/${localImg}` : product.thumbnail
    );

    return (
        <motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -10,
            }}
            key={product.title}
            className="group/product h-72 md:h-[30rem] w-[18rem] md:w-[38rem] relative shrink-0"
        >
            <div className="block h-full w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl relative">
                <Image
                    src={imgSrc}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 38rem"
                    className="object-cover object-center grayscale-[0.3] brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                    onError={() => setImgSrc(product.thumbnail)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
            </div>
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-20 pointer-events-none">
                <h2 className="text-white text-lg md:text-3xl font-black tracking-tighter uppercase max-w-[80%]">
                    {product.title}
                </h2>
                <div className="h-1 w-0 group-hover:w-full bg-blue-500 transition-all duration-500 rounded-full" />
            </div>
        </motion.div>
    );
};
