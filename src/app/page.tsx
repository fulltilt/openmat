import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MapPin, Search, Users, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-blue-50 to-white">
      <main className="m-auto flex-1">
        <section className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 py-12 text-white md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Find Your Next BJJ Open Mat
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Discover and connect with Brazilian Jiu-Jitsu open mats near
                  you. Train, learn, and grow your skills with fellow BJJ
                  enthusiasts.
                </p>
              </div>
              {/* <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-white text-black"
                    placeholder="Enter your location"
                    type="text"
                  />
                  <Button
                    type="submit"
                    className="bg-yellow-400 text-blue-900 transition-colors hover:bg-yellow-300"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Find Open Mats
                  </Button>
                </form>
              </div> */}
            </div>
          </div>
        </section>
        <section className="bg-white py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-3xl font-bold tracking-tighter text-transparent sm:text-5xl">
              Why Use BJJ Open Mat Finder?
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-blue-50 to-white p-6 text-center shadow-md transition-shadow hover:shadow-lg">
                <Users className="mb-4 h-12 w-12 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  Connect with BJJ Community
                </h3>
                <p className="text-sm text-gray-600">
                  Meet and train with diverse BJJ practitioners in your area.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-purple-50 to-white p-6 text-center shadow-md transition-shadow hover:shadow-lg">
                <MapPin className="mb-4 h-12 w-12 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  Find Nearby Open Mats
                </h3>
                <p className="text-sm text-gray-600">
                  Easily locate open mat sessions close to your location.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-yellow-50 to-white p-6 text-center shadow-md transition-shadow hover:shadow-lg">
                <Calendar className="mb-4 h-12 w-12 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  Flexible Training Schedule
                </h3>
                <p className="text-sm text-gray-600">
                  Discover open mats that fit your busy lifestyle.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="w-full bg-gradient-to-r from-blue-800 via-purple-800 to-blue-900 py-12 text-white md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Roll?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community of BJJ enthusiasts and never miss an
                opportunity to train.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-2">
                <Input
                  className="max-w-lg flex-1 bg-white text-black"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button
                  type="submit"
                  className="bg-yellow-400 text-blue-900 transition-colors hover:bg-yellow-300"
                >
                  Sign Up for Free
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section> */}
        {/* <section className="w-full bg-white py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-3xl font-bold tracking-tighter text-transparent sm:text-5xl">
            What Our Users Say
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-blue-50 to-white p-6 text-center shadow-md">
              <Star className="mb-4 h-8 w-8 text-yellow-400" />
              <p className="mb-4 text-sm text-gray-600">
                "BJJ Open Mat Finder has revolutionized my training. I've met so
                many great training partners!"
              </p>
              <p className="text-sm font-bold text-gray-800">
                - Sarah J., Blue Belt
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-purple-50 to-white p-6 text-center shadow-md">
              <Star className="mb-4 h-8 w-8 text-yellow-400" />
              <p className="mb-4 text-sm text-gray-600">
                "As a traveler, this app has been a game-changer. I can find
                open mats wherever I go!"
              </p>
              <p className="text-sm font-bold text-gray-800">
                - Mike T., Purple Belt
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-yellow-50 to-white p-6 text-center shadow-md">
              <Star className="mb-4 h-8 w-8 text-yellow-400" />
              <p className="mb-4 text-sm text-gray-600">
                "The variety of training opportunities I've found through this
                platform is amazing. Highly recommended!"
              </p>
              <p className="text-sm font-bold text-gray-800">
                - Lisa R., Brown Belt
              </p>
            </div>
          </div>
        </div>
      </section> */}
      </main>
    </div>
  );
}
