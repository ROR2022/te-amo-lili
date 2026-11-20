import Image from 'next/image'
import { motion } from 'framer-motion'
import { serie } from '@/data/serie'
import { reveal } from './animations'

export function CastRow() {
 return <motion.section className="content-section cast-section" {...reveal}><div className="section-heading"><h2>Reparto</h2><span>Los protagonistas de esta historia</span></div><div className="cast-list">{serie.cast.filter((person) => person.role !== 'Estrella invitada').map((person) => <motion.div className="cast-person" key={person.name} whileHover={{ y: -5 }}><div className="cast-photo"><Image src={person.photo} alt={person.name} fill sizes="76px" unoptimized /></div><div><strong>{person.name}</strong><span>{person.role}</span></div></motion.div>)}</div></motion.section>
}
