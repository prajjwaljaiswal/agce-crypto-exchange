import { STEPS } from '../data/index.js'

export function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="bg-[#fcf5ea] pb-20">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="text-center pt-16 pb-12">
            <h2 className="text-[52px] font-semibold leading-[1.05] text-[#1d1d1d] mb-4">
              How it works
            </h2>
            <p className="text-lg text-[#353945] leading-6">
              A powerful crypto platform designed for speed, security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ number, icon, title, description }) => (
              <div
                key={number}
                className="flex flex-col items-center text-center rounded-[20px] pt-10 pb-10 px-6 bg-white"
              >
                <div className="flex items-center justify-center mb-5 w-[200px] h-[200px]">
                  <img src={icon} alt={title} className="w-[180px] h-[180px] object-contain" />
                </div>

                <p className="text-sm text-[#2c3131] mb-2 leading-[1.25]">{number}</p>
                <h3 className="text-2xl font-bold text-[#2c3131] mb-3 leading-[1.25]">{title}</h3>
                <p className="text-base text-[#777e90] leading-[1.5] max-w-[335px]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
