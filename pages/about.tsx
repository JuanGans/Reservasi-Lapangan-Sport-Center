import { useState } from "react";
import MainLayout from "@/layout/MainLayout";
import LandingAnimation from "@/components/animation/LandingAnimation";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  nim: string;
  image: string;
  linkedin: string;
  github: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Juan Felix A. N. T.",
    role: "Project Manager",
    nim: "2241720042",
    image: "/assets/team/juan_team.png",
    linkedin: "https://linkedin.com/in/andipratama",
    github: "https://github.com/andipratama",
  },
  {
    id: 2,
    name: "Zhubair Abhel F. M. Z.",
    role: "UI / UX Designer",
    image: "/assets/team/abhel_team.png",
    nim: "2141720248",
    linkedin: "https://linkedin.com/in/sarimelati",
    github: "https://github.com/sarimelati",
  },
  {
    id: 3,
    name: "Ellois Karina H.",
    role: "Front End Dev.",
    nim: "2241720154",
    image: "/assets/team/ello_team.png",
    linkedin: "https://linkedin.com/in/budisantoso",
    github: "https://github.com/budisantoso",
  },
  {
    id: 4,
    name: "M. Imam Hanafi",
    role: "Back End Dev.",
    nim: "2241720151",
    image: "/assets/team/imam_team.png",
    linkedin: "https://linkedin.com/in/rinadewi",
    github: "https://github.com/rinadewi",
  },
  {
    id: 5,
    name: "Alifia Bilqi F.",
    role: "Quality Assurance",
    nim: "2241720024",
    image: "/assets/team/alifia_team.png",
    linkedin: "https://linkedin.com/in/tonowijaya",
    github: "https://github.com/tonowijaya",
  },
];

export default function About() {
  // State untuk menyimpan anggota tim yang card-nya sedang flipped
  const [flippedId, setFlippedId] = useState<number | null>(null);

  const toggleFlip = (id: number) => {
    setFlippedId(flippedId === id ? null : id);
  };

  return (
    <MainLayout title="About Us">
      <section className="bg-blue-900 text-white pt-24 pb-12 px-6 md:px-12 text-center">
        {/* Logo dengan background putih dan rounded */}
        <LandingAnimation>
          <div className="inline-block bg-white rounded-full p-4 mb-6">
            <img src="/assets/logo/jsc.png" alt="JTI Sport Center Logo" className="w-24 md:w-36" />
          </div>
        </LandingAnimation>

        <LandingAnimation delay={0.1}>
          <h1 className="text-2xl md:text-4xl font-bold mb-4">About JTI Sport Center</h1>
        </LandingAnimation>
        <LandingAnimation delay={0.2}>
          <p className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed mb-10">
            JTI Sport Center adalah pusat olahraga terkemuka yang menyediakan berbagai fasilitas olahraga berkualitas tinggi untuk masyarakat Polinema dan sekitarnya. Kami berkomitmen memberikan layanan terbaik dengan fasilitas modern dan
            tim profesional yang siap membantu Anda meraih performa terbaik.
          </p>
        </LandingAnimation>

        <section className="max-w-5xl mx-auto mt-12 px-6 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-800">
          {/* Card Visi & Misi */}
          <LandingAnimation delay={0.3}>
            <div className="bg-white rounded-lg shadow-lg p-8 flex items-center space-x-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-blue-900">Visi & Misi</h2>
                <h3 className="text-lg font-semibold mb-2">Visi</h3>
                <p className="mb-6">Menjadi pusat olahraga unggulan yang mendukung pengembangan olahraga dan kesehatan masyarakat secara berkelanjutan.</p>
                <h3 className="text-lg font-semibold mb-2">Misi</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Menyediakan fasilitas olahraga berkualitas dan terjangkau.</li>
                  <li>Mendorong kegiatan olahraga yang inklusif untuk semua kalangan.</li>
                  <li>Mengembangkan program latihan dan edukasi olahraga.</li>
                  <li>Mendukung komunitas olahraga lokal dan nasional.</li>
                </ul>
              </div>
            </div>
          </LandingAnimation>

          {/* Card Filosofi Logo */}
          <LandingAnimation delay={0.3}>
            <div className="bg-white rounded-lg shadow-lg p-8 flex items-center space-x-6 md:space-x-reverse md:flex-row-reverse">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-blue-900">Asal Usul & Filosofi Logo</h2>
                <p className="text-sm md:text-base">
                  Logo <strong>JTI SPORT CENTER</strong> mengusung desain minimalis dan modern yang merefleksikan teknologi digital dan olahraga.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-sm md:text-base">
                  <li>Elemen lingkaran melambangkan bola dan dinamika olahraga.</li>
                  <li>Warna biru menonjolkan kepercayaan dan profesionalisme.</li>
                  <li>Tipografi sans-serif tegas untuk kesan modern dan mudah diakses.</li>
                  <li>Proporsi dan tata letak seimbang menggunakan prinsip rasio emas.</li>
                </ul>
              </div>
            </div>
          </LandingAnimation>
        </section>
      </section>

      <section className="py-12 px-6 md:px-12 bg-white text-gray-800">
        <LandingAnimation>
          <h2 className="text-2xl md:text-4xl font-semibold text-center mb-10">Meet Our Team</h2>
        </LandingAnimation>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {teamMembers.map((member) => {
            const isFlipped = flippedId === member.id;
            return (
              <>
                <LandingAnimation key={member.id} delay={member.id * 0.1}>
                  <div key={member.id} className="perspective" onClick={() => toggleFlip(member.id)}>
                    <div className={`relative w-full h-72 cursor-pointer duration-700 transform-style preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>
                      {/* Front Side */}
                      <div className="absolute w-full h-full backface-hidden bg-gray-100 rounded-lg p-4 shadow flex flex-col items-center justify-center">
                        <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover mb-4" />
                        <h3 className="text-xl font-semibold text-center">{member.name}</h3>
                        <p className="text-gray-600 text-center">{member.role}</p>
                        <p className="text-xs text-gray-500 text-center">{member.nim}</p>
                        <p className="mt-2 text-sm text-gray-500 italic">(Klik untuk lihat kontak)</p>
                      </div>

                      {/* Back Side */}
                      <div className="absolute w-full h-full backface-hidden bg-blue-900 rounded-lg p-6 shadow text-white rotate-y-180 flex flex-col items-center justify-center space-y-4">
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                        <p className="italic">{member.role}</p>
                        <p className="text-xs text-blue-300">{member.nim}</p>
                        <div className="flex space-x-6 mt-4">
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition" aria-label={`${member.name} LinkedIn`}>
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11.5 19h-3v-9h3v9zm-1.5-10.3c-1 0-1.8-.81-1.8-1.8s.8-1.7 1.8-1.7c1 0 1.8.8 1.8 1.7s-.8 1.8-1.8 1.8zm13 10.3h-3v-4.8c0-1.1-.4-1.8-1.4-1.8-.7 0-1.1.5-1.3 1-.1.3-.1.7-.1 1.1v4.5h-3v-9h3v1.2c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1v5.2z" />
                            </svg>
                          </a>
                          <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition" aria-label={`${member.name} GitHub`}>
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.263.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.332-1.754-1.332-1.754-1.09-.745.082-.73.082-.73 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.304.763-1.604-2.665-.3-5.466-1.336-5.466-5.935 0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.49 11.49 0 0 1 3.003-.404c1.02.004 2.045.138 3.004.404 2.288-1.553 3.293-1.23 3.293-1.23.655 1.653.244 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.632-5.48 5.93.43.37.814 1.103.814 2.222 0 1.606-.015 2.9-.015 3.293 0 .32.215.7.825.58C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                        </div>
                        <p className="mt-3 text-sm text-blue-300 italic">Klik lagi untuk kembali</p>
                      </div>
                    </div>
                  </div>
                </LandingAnimation>
              </>
            );
          })}
        </div>
      </section>

      {/* Styles for flip animation */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style {
          transform-style: preserve-3d;
        }
      `}</style>
    </MainLayout>
  );
}
