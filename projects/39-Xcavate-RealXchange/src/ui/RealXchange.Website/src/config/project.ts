import { Icons } from '@/components/icons';
import { Category, Project, ProjectCategory } from '@/types';

export const featuredProjects = [
  {
    title: 'Let’s plant 1 million trees',
    image: '/images/projects/project-one.png',
    category: 'environment'
  },
  {
    title: 'Wildlife',

    image: '/images/projects/project-two.png',
    category: 'ecology'
  },
  {
    title: 'Save the trees',
    image: '/images/projects/project-three.png',
    category: 'housing'
  }
] satisfies Pick<Project, 'title' | 'image' | 'category'>[];

export const projects = [
  {
    id: 1,
    title: 'Sustainable Living',
    foundationName: 'GreenHaven',
    image: '/images/projects/project-five.png',
    category: 'housing',
    price: '250000',
    noOfNFTs: 100,
    description: ''
  },
  {
    id: 2,
    title: 'Let’s plant one million tre...',
    foundationName: 'GreenHaven',
    image: '/images/projects/project-six.png',
    category: 'environment',
    price: '550000',
    noOfNFTs: 100,
    description: ''
  },
  {
    id: 2,
    title: 'Uniting Ecology',
    foundationName: 'EcoPulse',
    image: '/images/projects/project-five.png',
    category: 'social',
    price: '345000',
    noOfNFTs: 100,
    description: ''
  },
  {
    id: 4,
    title: 'GreenSynergy',
    foundationName: 'Trillion_Treesfoundation',
    image: '/images/projects/project-seven.png',
    category: 'social',
    price: '250000',
    noOfNFTs: 100,
    description: ''
  },
  {
    id: 5,
    title: 'Wildlife',
    foundationName: 'Ecologymind',
    image: '/images/projects/project-two.png',
    category: 'ecology',
    price: '250000',
    noOfNFTs: 100,
    description: ''
  },
  {
    id: 6,
    title: 'Save the trees',
    foundationName: 'James pocket',
    image: '/images/projects/project-three.png',
    category: 'housing',
    price: '25000',
    noOfNFTs: 100,
    description: ''
  },
  {
    id: 7,
    title: 'Home and Earth',
    foundationName: 'James pocket',
    image: '/images/projects/project-four.png',
    category: 'housing',
    price: '25000',
    noOfNFTs: 100,
    description: ''
  },
  {
    id: 8,
    title: 'Nurturing Natures Balance',
    foundationName: 'BiosphereRescue',
    image: '/images/projects/project-one.png',
    category: 'ecology',
    price: '25000',
    noOfNFTs: 100,
    description: ''
  }
] satisfies Project[];
