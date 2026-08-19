import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	ArrowRight,
	CalendarDays,
	ChevronDown,
	CircleDot,
	Dna,
	Layers3,
	Mountain,
	Sprout,
	Sun,
	Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { eras } from "@/data/eras";
import { getAnimalsByEra, type AnimalRecord } from "@/services/animals";
import { Card3D } from "@/features/animals/components/cards/Card3D";

const railIcons: LucideIcon[] = [CircleDot, Waves, Sprout, Mountain, Dna, Layers3];

function formatPeriod(period: string) {
	const [start, end] = period.split(" – ");
	if (!end) return period;
	return `${start.replace(" Ma", "")} – ${end.replace(" Ma", "")} million years ago`;
}

export default function EraPage2() {
	const { eraId } = useParams<{ eraId?: string }>();
	const [searchParams] = useSearchParams();
	const resolvedEra = eras.find((item) => item.id === eraId) ?? eras.find((item) => item.id === "paleozoic");
	const queryEraId = resolvedEra?.id ?? "paleozoic";
	const [activeAnimalIndex, setActiveAnimalIndex] = useState(1);
	const { data: animals = [], isLoading, error } = useQuery({
		queryKey: ["era2-animals", queryEraId],
		queryFn: () => getAnimalsByEra(queryEraId, { summary: true }),
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
		refetchOnWindowFocus: false,
	});
	const carouselAnimals = useMemo(() => animals.slice(0, 4), [animals]);
	const activeIndex = carouselAnimals.length
		? Math.min(activeAnimalIndex, carouselAnimals.length - 1)
		: 0;

	if (!resolvedEra) return null;

	const era = resolvedEra;
	const activeSuberaId = searchParams.get("subera") ?? era.suberas[0]?.id;
	const accent = era.id === "paleozoic" ? "#c9f34b" : era.color;
	const featuredSpecies = era.id === "paleozoic"
		? 28
		: era.suberas.reduce((total, item) => total + item.featuredSpeciesCount, 0);

	return (
		<main className="relative min-h-[100svh] overflow-hidden bg-[#020a0d] text-white">
			<section className="relative isolate h-[100svh] overflow-hidden" aria-labelledby="era-page-2-title">
				<img
					src={era.image}
					alt=""
					className="absolute inset-0 w-full h-full object-cover object-center"
				/>
				<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,7,9,0.98)_0%,rgba(1,7,9,0.88)_18%,rgba(1,7,9,0.46)_42%,rgba(1,7,9,0.08)_70%)]" />
				

				<header className="absolute inset-x-0 top-0 z-10 mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-[3.5vw]">
					<Link to="/" className="inline-flex items-center gap-2.5" aria-label="Evolution3D home">
						<img src="/images/logo3.png" alt="Evolution3D logo" className="h-20 w-auto"></img>
					</Link>

					<nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex" aria-label="Primary navigation">
						<Link to="/timeline" className="text-md text-white/65 transition-colors hover:text-white">Timeline</Link>
						{eras.slice(1).map((item) => (
							<Link
								key={item.id}
								to={`/era2/${item.id}`}
								className={`text-md transition-colors ${item.id === era.id ? "text-[#c9f34b]" : "text-white/60 hover:text-white"}`}
							>
								{item.name.replace(" Era", "")}
							</Link>
						))}
						<a href="#suberas" className="text-md text-white/60 transition-colors hover:text-white">About</a>
					</nav>

					<button
						type="button"
						aria-label="Toggle ambient light"
						className="grid size-9 place-items-center rounded-full border border-white/10 bg-black/15 text-white/75 transition-colors hover:border-white/30 hover:text-white"
					>
						<Sun className="size-4" aria-hidden />
					</button>
				</header>

				<div className="absolute inset-x-0 top-[clamp(6rem,16vh,11rem)] z-10 px-5 sm:px-8 lg:left-[7.1vw] lg:right-auto lg:px-0">
					<article className="max-w-[42rem]">
						<Link to="/timeline" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65 transition-colors hover:text-white sm:text-xs">
							<ArrowLeft className="size-3.5" aria-hidden />
							Back to timeline
						</Link>

						<h1 id="era-page-2-title" className="mt-5 whitespace-nowrap text-[clamp(3.4rem,6.2vw,5.2rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-white">
							{era.name.replace(" Era", "")} <span style={{ color: accent }}>Era</span>
						</h1>
						<p className="mt-4 text-base font-semibold tracking-[-0.01em] sm:text-lg" style={{ color: accent }}>
							{formatPeriod(era.period)}
						</p>
						<p className="mt-3 max-w-[24rem] text-[13px] leading-[1.75] text-white/70">
							{era.description}
						</p>

						<div className="mt-4 grid w-fit max-w-full grid-cols-[6.8rem_6.2rem_8.8rem] gap-2 sm:gap-3">
							<Metric icon={CalendarDays} label="Duration" value={era.duration.replace("≈ ", "≈")} />
							<Metric icon={Layers3} label="Suberas" value={String(era.suberas.length)} />
							<Metric icon={Dna} label="Featured species" value={String(featuredSpecies)} />
						</div>

						<a
							href="#creatures"
							  className="mt-6 inline-flex items-center gap-4 rounded-md px-4 py-3 text-xs font-bold text-[#081208] shadow-[0_12px_34px_rgba(0,0,0,0.3)] transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-105"
							style={{ backgroundColor: accent }}
						>
							Explore this Era
							<ArrowRight className="size-4" aria-hidden />
						</a>
					</article>
				</div>

				<nav
					id="suberas"
					  className="absolute inset-x-4 bottom-[clamp(1.25rem,3.4vw,3.4rem)] z-10 mx-auto max-w-[1240px] sm:inset-x-8 lg:inset-x-[7.1vw]"
					aria-label={`Suberas of ${era.name}`}
				>
					<div className="overflow-hidden rounded-2xl border border-white/15 bg-[#000000]/80 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-4xl">
						<div className="flex items-stretch gap-3 p-3 sm:gap-5 sm:p-4">
							<div className="flex w-[7.5rem] shrink-0 flex-col justify-center border-r border-white/10 pr-3 sm:w-[8.8rem] sm:pr-5">
								<span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">Suberas of</span>
								<strong className="mt-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-white/90 sm:text-xs">
									the {era.name.replace(" Era", "")}
								</strong>
							</div>

							<div className="relative min-w-0 flex-1 overflow-x-auto">
								<div className="absolute bottom-1 left-4 right-4 h-px bg-white/15" aria-hidden="true" />
								<div className="relative flex min-w-[43rem] gap-1 sm:min-w-0 sm:gap-2">
									{era.suberas.map((subera, index) => {
										const Icon = railIcons[index % railIcons.length];
										const active = subera.id === activeSuberaId;
										return (
											<Link
												key={subera.id}
												to={`/era2/${era.id}?subera=${subera.id}`}
												className={`group relative flex min-w-[7.1rem] flex-1 items-center gap-2 px-2 pb-3 pt-1 sm:min-w-0 sm:px-3 ${active ? "text-white" : "text-white/55 hover:text-white"}`}
												aria-current={active ? "page" : undefined}
											>
												<Icon className={`size-5 shrink-0 sm:size-6 ${active ? "text-[#c9f34b]" : "text-white/35 group-hover:text-white/75"}`} aria-hidden />
												<span className="min-w-0">
													<span className="block truncate text-[10px] font-semibold sm:text-xs">{subera.name}</span>
													<span className="mt-1 block truncate text-[9px] text-white/45 sm:text-[10px]">{subera.period}</span>
												</span>
												<span className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${active ? "bg-[#c9f34b] shadow-[0_0_12px_#c9f34b]" : "bg-transparent group-hover:bg-white/30"}`} />
											</Link>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</nav>
			</section>

			<section id="creatures" className="relative overflow-hidden bg-[#020a0d] px-5 py-[clamp(2rem,5vh,4rem)] sm:px-8 md:h-[100svh] md:min-h-0 md:px-[clamp(2rem,6.3vw,6rem)] md:py-[clamp(1.5rem,4vh,3rem)] lg:px-[6.3vw]" aria-labelledby="creatures-title">
				<div className="mx-auto w-full max-w-[1760px]">
					<header className="flex flex-col justify-between gap-[clamp(0.75rem,2vh,1.5rem)] sm:flex-row sm:items-end">
						<div>
							<p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
								<span className="size-1.5 rounded-full bg-[#c9f34b] shadow-[0_0_10px_#c9f34b]" aria-hidden />
								Discover
							</p>
							<h2 id="creatures-title" className="mt-3 text-[clamp(2rem,3.1vw,3.5rem)] font-semibold tracking-[-0.055em] text-white">
								Creatures of the {era.name.replace(" Era", "")}
							</h2>
						</div>
						<div className="flex items-end justify-between gap-[clamp(1.5rem,2.5vw,3.5rem)] sm:max-w-[clamp(25rem,29vw,34rem)]">
							<p className="max-w-[clamp(15rem,18vw,21rem)] text-[clamp(0.75rem,0.85vw,1rem)] leading-[1.65] text-white/55">
								Explore some of the most fascinating species that lived during this incredible era.
							</p>
							<Link to="/museum" className="inline-flex shrink-0 items-center gap-[clamp(1rem,1.5vw,1.5rem)] rounded-md border border-[#c9f34b]/35 px-[clamp(1rem,1.5vw,1.5rem)] py-[clamp(0.625rem,0.8vw,0.875rem)] text-[clamp(0.625rem,0.7vw,0.8125rem)] font-semibold text-[#d9f68b] transition-colors hover:border-[#c9f34b] hover:bg-[#c9f34b]/10">
								View all species
								<ArrowRight className="size-3.5" aria-hidden />
							</Link>
						</div>
					</header>

					<div className="relative mt-[clamp(1rem,2vh,2rem)]">
						<button
							type="button"
							aria-label="Previous creature"
							disabled={activeIndex === 0 || carouselAnimals.length === 0}
							onClick={() => setActiveAnimalIndex((index) => Math.max(0, index - 1))}
							className="absolute left-[-1.5rem] top-1/2 z-20 grid size-[clamp(2.5rem,3.2vw,4rem)] -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#071316]/90 text-white/75 backdrop-blur-md transition-colors hover:border-[#c9f34b]/60 hover:text-[#c9f34b] disabled:pointer-events-none disabled:opacity-30 sm:left-[-2.5rem]"
						>
							<ArrowLeft className="size-[clamp(1rem,1.2vw,1.35rem)]" aria-hidden />
						</button>

						<div className="carousel-scroll flex items-end justify-start gap-[clamp(0.5rem,0.7vw,0.875rem)] overflow-x-auto px-1 pb-2 sm:justify-center sm:overflow-visible">
							{isLoading && [0, 1, 2, 3].map((item) => (
								<div key={item} className="h-[clamp(12.5rem,30vh,19rem)] w-[clamp(11.5rem,18vw,20.5rem)] shrink-0 animate-pulse rounded-xl border border-white/10 bg-white/[0.04]" />
							))}
							{!isLoading && carouselAnimals.map((animal, index) => (
								<CreatureCard
									key={animal.id ?? animal.name}
									animal={animal}
									active={index === activeIndex}
									accent={accent}
									onActivate={() => setActiveAnimalIndex(index)}
								/>
							))}
							{!isLoading && carouselAnimals.length === 0 && (
								<p className="w-full py-20 text-center text-sm text-white/45">
									{error ? "Unable to load the creatures of this era." : "No creatures are indexed yet."}
								</p>
							)}
						</div>

						<button
							type="button"
							aria-label="Next creature"
							disabled={activeIndex >= carouselAnimals.length - 1 || carouselAnimals.length === 0}
							onClick={() => setActiveAnimalIndex((index) => Math.min(carouselAnimals.length - 1, index + 1))}
							className="absolute right-[-2.75rem] top-1/2 z-20 grid size-[clamp(2.5rem,3.2vw,4rem)] -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#071316]/90 text-white/75 backdrop-blur-md transition-colors hover:border-[#c9f34b]/60 hover:text-[#c9f34b] disabled:pointer-events-none disabled:opacity-30 sm:right-[-3.75rem]"
						>
							<ArrowRight className="size-[clamp(1rem,1.2vw,1.35rem)]" aria-hidden />
						</button>
					</div>

					<div className="mt-[clamp(1rem,2.5vh,1.75rem)] flex justify-center gap-[clamp(0.5rem,0.75vw,0.875rem)]" aria-label="Creature carousel position">
						{carouselAnimals.map((animal, index) => (
							<button
								key={animal.id ?? animal.name}
								type="button"
								aria-label={`Show ${animal.name}`}
								aria-current={index === activeIndex ? "true" : undefined}
								onClick={() => setActiveAnimalIndex(index)}
								className={`size-[clamp(0.375rem,0.5vw,0.625rem)] rounded-full transition-colors ${index === activeIndex ? "bg-[#c9f34b] shadow-[0_0_8px_#c9f34b]" : "bg-white/25 hover:bg-white/55"}`}
							/>
						))}
					</div>

					<div className="mt-[clamp(1.25rem,3vh,2.25rem)] grid min-h-[clamp(5rem,12vh,7.5rem)] overflow-hidden rounded-[clamp(0.75rem,1vw,1.25rem)] border border-white/10 bg-[#071316]/75 sm:grid-cols-2 md:grid-cols-4">
						{[
							{ icon: Sprout, label: "First life explosion", value: era.highlights[0] },
							{ icon: Mountain, label: "Land colonization", value: era.highlights[1] },
							{ icon: Waves, label: "Oxygen rise", value: era.climate },
							{ icon: CircleDot, label: "Massive diversity", value: era.highlights[2] },
						].map(({ icon: Icon, label, value }) => (
							<div key={label} className="flex gap-[clamp(0.625rem,1vw,1rem)] border-white/10 px-[clamp(0.75rem,1.2vw,1.5rem)] py-[clamp(0.75rem,1.5vh,1.25rem)] first:border-0 sm:border-l">
								<Icon className="mt-0.5 size-[clamp(1.25rem,1.5vw,1.75rem)] shrink-0 text-[#c9f34b]" aria-hidden />
								<div>
									<p className="text-[clamp(0.625rem,0.75vw,0.875rem)] font-semibold capitalize text-white/80">{label}</p>
									<p className="mt-1 text-[clamp(0.625rem,0.75vw,0.875rem)] leading-[1.7] text-white/50">{value}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<ChevronDown className="absolute bottom-[clamp(0.75rem,2vh,1.5rem)] left-1/2 size-5 -translate-x-1/2 text-white/40" aria-hidden />
			</section>
		</main>
	);
}

function CreatureCard({
	animal,
	active,
	accent,
	onActivate,
}: {
	animal: AnimalRecord;
	active: boolean;
	accent: string;
	onActivate: () => void;
}) {
	return (
		<article
			className={`group relative shrink-0 overflow-hidden rounded-[clamp(0.75rem,1vw,1.25rem)] border bg-[#071316]/80 transition-[width,height,border-color,transform,opacity] duration-500 ease-out ${active ? "w-[clamp(14rem,21vw,24rem)] border-[#c9f34b]/70" : "w-[clamp(11.5rem,18vw,20.5rem)] border-white/10 opacity-80 hover:opacity-100"}`}
			style={{ borderColor: active ? accent : undefined }}
			onClick={onActivate}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") onActivate();
			}}
			tabIndex={0}
			aria-label={`Select ${animal.name}`}
		>
			<Card3D
				animal={animal}
				widthClass="w-full"
				heightClass={active ? "h-[clamp(14rem,34vh,22rem)]" : "h-[clamp(12.5rem,30vh,19rem)]"}
				modelScale={active ? 2.8 : 2.9}
				showMeta={false}
				autoRotate
				rootMargin="180px"
				className="!rounded-none !border-0 !shadow-none !transition-[height] !duration-500"
			/>
			<div className="border-t border-white/10 px-[clamp(0.75rem,1vw,1rem)] py-[clamp(0.75rem,1.2vh,1.25rem)]">
				<h3 className="truncate text-[clamp(0.9rem,1.1vw,1.125rem)] font-medium text-white">{animal.name}</h3>
				<p className="mt-1 truncate text-[clamp(0.625rem,0.7vw,0.75rem)] font-medium" style={{ color: accent }}>
					{animal.className ?? "Ancient life"}
				</p>
				<div className="mt-[clamp(0.5rem,1vh,1rem)] flex items-center gap-[clamp(0.375rem,0.6vw,0.625rem)] text-[clamp(0.625rem,0.7vw,0.75rem)] text-white/55">
					<Dna className="size-[clamp(0.875rem,1vw,1.125rem)] shrink-0 text-[#c9f34b]" aria-hidden />
					<span className="truncate">{animal.subtitle ?? animal.description}</span>
				</div>
				<Link
						to={`/animal/${encodeURIComponent(animal.name)}`}
						aria-hidden={!active}
						tabIndex={active ? 0 : -1}
						className={`mt-[clamp(0.5rem,1vh,1rem)] flex items-center justify-center gap-[clamp(0.5rem,0.8vw,0.75rem)] rounded-md border border-white/10 py-[clamp(0.375rem,0.6vh,0.625rem)] text-[clamp(0.625rem,0.7vw,0.75rem)] font-semibold text-[#c9f34b] transition-[opacity,border-color,background-color] duration-500 hover:border-[#c9f34b]/50 hover:bg-[#c9f34b]/10 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
						onClick={(event) => event.stopPropagation()}
					>
						View details
						<ArrowRight className="size-3.5" aria-hidden />
					</Link>
			</div>
		</article>
	);
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
	return (
		<div className="min-w-0 rounded-lg border border-white/10 bg-[#071316]/60 px-3 py-2.5 backdrop-blur-md">
			<div className="flex items-center gap-1.5">
				<Icon className="size-4 shrink-0 text-[#c9f34b]" aria-hidden />
				<span className="truncate text-[9px] font-medium uppercase tracking-[0.08em] text-white/55">{label}</span>
			</div>
			<p className="mt-1 truncate text-xs font-semibold text-white">{value}</p>
		</div>
	);
}
