require 'net/http'

Thread.new do
  loop do
    sleep 60
    Net::HTTP.get('spg.herokuapp.com', '/')
  end
end
