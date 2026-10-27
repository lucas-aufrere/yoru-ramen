import { anchors } from '@/content/navigation';
import { Categories } from '@/sections/Categories';
import { Combos } from '@/sections/Combos';
import { Contact } from '@/sections/Contact';
import { Feast } from '@/sections/Feast';
import { Hero } from '@/sections/Hero';
import { Ingredients } from '@/sections/Ingredients';
import { Menu } from '@/sections/Menu';
import { Ramens } from '@/sections/Ramens';
import { Socials } from '@/sections/Socials';
import { Street } from '@/sections/Street';
import { Welcome } from '@/sections/Welcome';

export default function Home() {
  return (
    <main id={anchors.main}>
      <Hero />
      <Welcome />
      <Ingredients />
      <Ramens />
      <Menu />
      <Categories />
      <Feast />
      <Combos />
      <Street />
      <Contact />
      <Socials />
    </main>
  );
}
