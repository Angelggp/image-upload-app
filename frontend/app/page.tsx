import { ImageUploader } from '@/components/ImageUploader'

export default function Home() {
  return (
    <>
      <main className="flex-1 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ImageUploader />
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Made with ❤️ for image sharing
          </p>
        </div>
      </footer>
    </>
  )
}