import { Button } from "../ui/button"

const Home = () => {
  return (
    <main>
      <div className="bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to <span className="text-primary">Our Platform</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Discover amazing features and boost your productivity with our
              cutting-edge solutions. Start your journey today and unlock your
              full potential.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg">Get started</Button>
              <Button variant="outline" size="lg">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
