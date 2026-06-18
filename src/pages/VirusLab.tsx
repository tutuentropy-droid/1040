import NavHeader from '@/components/common/NavHeader';
import VirusSimulation from '@/components/virus/VirusSimulation';

export default function VirusLab() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#0f1624' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(201,169,98,0.06) 0%, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(155,89,182,0.06) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(52,152,219,0.04) 0%, transparent 60%)
          `,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #e8e4d9 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <NavHeader />

      <main className="relative z-10 pt-24 md:pt-28 pb-10">
        <VirusSimulation />
      </main>
    </div>
  );
}
