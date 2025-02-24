package epsilongtmyon.app.endpoint.sandbox01;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import epsilongtmyon.app.endpoint.sandbox01.spec.Get01Request;
import epsilongtmyon.app.endpoint.sandbox01.spec.Post01Request;
import epsilongtmyon.app.endpoint.sandbox01.spec.Post01UploadRequest;

@RequestMapping("/sandbox01")
@RestController
public class Sandbox01Controller {

	@GetMapping("")
	public ModelAndView index() {
		return new ModelAndView("sandbox01/index");
	}

	@GetMapping("/get01")
	public Map<String, Object> get01(Get01Request request) {
		System.out.println(request);
		return Map.of("value", "get01");
	}
	

	@PostMapping("/postJson01")
	public Map<String, Object> post01Json(@RequestBody Post01Request request) {
		System.out.println(request);
		return Map.of("value", "post01");
	}

	@PostMapping("/postForm01")
	public Map<String, Object> postForm01(@ModelAttribute Post01Request request) {
		System.out.println(request);
		return Map.of("value", "post01");
	}


	@PostMapping("/postUpload01")
	public Map<String, Object> postUpload01(@ModelAttribute Post01UploadRequest request) {
		System.out.println(request);
		return Map.of("value", "post01");
	}
}
