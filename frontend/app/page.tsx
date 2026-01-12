import { ImageUploader } from '@/components/ImageUploader'
import { ArrowUp } from 'lucide-react'

export default function Home() {
  return (
    <>
      <main className="flex-1 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ImageUploader />
      </main>

          <footer className="py-4 px-4 relative border-border flex flex-wrap justify-between items-center">
      {" "}
      <p className="text-sm text-center text-secondary m-auto">
        {" "}
        &copy; {new Date().getFullYear()}  AngelDev - Todos los derechos reservados.
      </p>

    </footer>
    </>
  )
}