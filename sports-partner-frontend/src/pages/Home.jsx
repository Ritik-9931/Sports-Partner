import HeroSection from "../components/home/HeroSection";
import PopularGames from "../components/home/PopularGames";
import NearbyPlayers from "../components/home/NearbyPlayers";
import Communities from "../components/home/Communities";
import CTASection from "../components/home/CTASection";

const Home = () => {

  return (
    <div className="bg-gray-50">
      <HeroSection />
      <PopularGames />
      <NearbyPlayers />
      <Communities />
      <CTASection />
    </div>
  );
};

export default Home;
