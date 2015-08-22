require 'net/http'

Thread.new do
  loop do
    sleep 60
    Net::HTTP.get('spg.herokuapp.com', '/')
    Net::HTTP.get('spg2.herokuapp.com', '/')
  end
end
