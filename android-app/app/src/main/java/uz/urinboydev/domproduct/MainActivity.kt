package uz.urinboydev.domproduct

import android.annotation.SuppressLint
import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.view.View
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import uz.urinboydev.domproduct.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        try {
            binding = ActivityMainBinding.inflate(layoutInflater)
            setContentView(binding.root)
        } catch (e: Exception) {
            Toast.makeText(this, "Ilova sozlamalarida xato: ${e.message}", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        // Qayta urinish tugmasi bosilganda
        binding.retryButton.setOnClickListener {
            loadWebView()
        }

        // Dastlab WebView ni yuklash
        loadWebView()

        // Orqaga qaytish tugmasini boshqarish
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (binding.webView.canGoBack()) {
                    binding.webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun loadWebView() {
        if (isNetworkAvailable()) {
            try {
                binding.errorLayout.visibility = View.GONE
                binding.webView.visibility = View.VISIBLE
                binding.webView.apply {
                    webViewClient = object : WebViewClient() {
                        override fun onReceivedError(
                            view: WebView?,
                            request: WebResourceRequest?,
                            error: WebResourceError?
                        ) {
                            super.onReceivedError(view, request, error)
                            binding.webView.visibility = View.GONE
                            binding.errorLayout.visibility = View.VISIBLE
                            Toast.makeText(
                                this@MainActivity,
                                "Sahifa yuklanmadi: ${error?.description}",
                                Toast.LENGTH_SHORT
                            ).show()
                        }

                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                            binding.webView.visibility = View.VISIBLE
                            binding.errorLayout.visibility = View.GONE
                        }
                    }
                    settings.javaScriptEnabled = true // Faqat kerak bo‘lsa yoqing
                    settings.domStorageEnabled = true
                    settings.loadWithOverviewMode = true
                    settings.useWideViewPort = true
                    loadUrl("https://dp.urinboydev.uz/")
                }
            } catch (e: Exception) {
                binding.webView.visibility = View.GONE
                binding.errorLayout.visibility = View.VISIBLE
                Toast.makeText(
                    this,
                    "WebView yuklashda xato: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        } else {
            binding.webView.visibility = View.GONE
            binding.errorLayout.visibility = View.VISIBLE
            Toast.makeText(
                this,
                getString(R.string.no_internet_message),
                Toast.LENGTH_LONG
            ).show()
        }
    }

    private fun isNetworkAvailable(): Boolean {
        return try {
            val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val network = connectivityManager.activeNetwork
            val capabilities = connectivityManager.getNetworkCapabilities(network)
            capabilities != null && (
                    capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ||
                            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
                    )
        } catch (e: Exception) {
            false
        }
    }
}